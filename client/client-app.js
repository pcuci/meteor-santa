import {getAdjacencyMatrix, isSymetric} from "../utils";

UserConnections = new Mongo.Collection("user_status_sessions");
relativeTime = function(timeAgo) {
  var ago, days, diff, time;
  diff = moment.utc(TimeSync.serverTime() - timeAgo);
  time = diff.format("H:mm:ss");
  days = +diff.format("DDD") - 1;
  ago = (days ? days + "d " : "") + time;
  return ago + " ago";
};
Handlebars.registerHelper("userStatus", UserStatus);
Handlebars.registerHelper("localeTime", function(date) {
  return date != null ? date.toLocaleString() : void 0;
});
Handlebars.registerHelper("relativeTime", relativeTime);
Template.Login.helpers({
  loggedIn: function() {
    return Meteor.userId();
  }
});

Template.Profile.helpers({
  single: function() {
    if (Meteor.user()) {
      if (Meteor.user().single) {
        return 'checked';
      } else {
        return '';
      }
    }
    return '';
  },
  conjoint: function() {
    if (Meteor.user()) {
      if (Meteor.user().single) {
        return '';
      } else {
        return 'checked';
      }
    }
    return '';
  },
  isConjoint: function() {
    return (Meteor.user()) ? !Meteor.user().single : false;
  }
});

Template.Profile.events({
  'change input[type=radio]': function (event, template) {
    single = template.find('input:radio[name=single]:checked').value;
    Meteor.call("setSingle", (single == "true"));
    Meteor.call("setSweetheart", undefined);
  }
})

Template.Conjoint.helpers({
  usernames: function() {
    var users = Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
    var usernames = _.pluck(users, 'username');
    return usernames
  }
});

Template.Conjoint.events({
  "change #username-select": function (event, template) {
    var username = $(event.currentTarget).val();
    console.log("username: " + username);
    Meteor.call("setSweetheart", username);
  }
});

Template.Matching.helpers({
  users: function() {
    return Meteor.users.find();
  },
  matchesExist: function() {
    return Meteor.users.findOne({gifteeId: {$exists: true}});
  },
  isMatchReady: function() {
    // Ensure everyone has declared their better halfs
    var isMatchReady = isSymetric(getAdjacencyMatrix(Meteor.users.find().fetch()));
    console.log("Match ready?", isMatchReady);
    return isMatchReady;
  },
  giftee: function() {
    if (Meteor.user() && Meteor.user().gifteeId) {
      return Meteor.users.findOne({_id: Meteor.user().gifteeId});
    } else {
      return null;
    }
  }
});

Template.All.helpers({
  users: function() {
    return Meteor.users.find();
  }
});

Template.Matching.events = {
  "click button[type=submit]": function(e, tmpl) {
    e.preventDefault();
    Meteor.call("matchSantas");
  },
  "click button[type=reset]": function(e, tmpl) {
    e.preventDefault();
    Meteor.call("clearSantas");
  }
};

Template.Login.events = {
  "submit form": function(e, tmpl) {
    var input;
    e.preventDefault();
    input = tmpl.find("input[name=username]");
    input.blur();
    return Meteor.insecureUserLogin(input.value, function(err, res) {
      if (err) {
        return console.log(err);
      }
    });
  }
};

Deps.autorun(function(c) {
  try {
    UserStatus.startMonitor({
      threshold: 30000,
      idleOnBlur: true
    });
    return c.stop();
  } catch (_error) {}
});
