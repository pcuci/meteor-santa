Template.Player.helpers({
  active: function() {
    return Meteor.user().sweetheart == this ? "active" : "";
  }
});
