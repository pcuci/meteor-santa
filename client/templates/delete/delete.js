Template.Delete.events({
  "click button": function(event, template) {
    event.preventDefault();
    Meteor.call("deleteAccount");
  }
});

Template.Delete.helpers({
  username: function() {
    return Meteor.user().username;
  }
});
