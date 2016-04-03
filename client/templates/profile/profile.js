Template.Profile.events({
  "click a": function (event, template) {
    event.preventDefault();
    var username = template.find(event.currentTarget).id;
    console.log("username: " + username);
    Meteor.call("setSweetheart", username);
  }
});

Template.Profile.helpers({
  active: function() {
    return Meteor.user().sweetheart ? "" : "active";
  },
  usernames: function() {
    var users = Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
    var usernames = _.pluck(users, 'username');
    return usernames
  }
});
