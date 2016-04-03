Template.Player.helpers({
  active: function() {
    return Meteor.user().sweetheart == this ? "active" : "";
  },
  match: function() {
    var player = Meteor.users.findOne({"username": "" + this});
    if (player) {
      return Meteor.user().gifteeId == player._id ? "list-group-item-success" : "";
    } else {
      return "";
    }
  },
  inLinks: function() {
    var inLinksUsers = Meteor.users.find({"sweetheart": "" + this}).fetch();
    inLinksUsernames = _.pluck(inLinksUsers, 'username');
    if (inLinksUsernames.length > 0) {
      return inLinksUsernames.join(' ');
    } else {
      return false;
    }
  },
  isCurrentPlayer: function() {
    return Meteor.user().username == "" + this;
  }
});
