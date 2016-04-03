Template.All.helpers({
  users: function() {
    return Meteor.users.find();
  }
});
