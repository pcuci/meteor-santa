Template.Player.helpers({
  active: function() {
    return Meteor.user().sweetheart == this ? "active" : "";
  },
  match: function() {
    var player = Meteor.users.findOne({"username": "" + this});
    if (player) {
      return Meteor.user().gifteeId == player._id ? "list-group-item-danger" : "";
    } else {
      return "";
    }
  }
});
