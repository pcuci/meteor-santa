Template.Attendees.helpers({
  users: function() {
    return Meteor.users.find();
  }
});
