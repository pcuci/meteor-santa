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
