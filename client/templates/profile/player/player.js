import {remainingCount} from "../../requirements/requirements.js";

Template.Player.helpers({
  active: function() {
    return Meteor.user().significantId == this._id ? "active" : "";
  },
  match: function() {
    var player = Meteor.users.findOne({_id: "" + this._id});
    if (player) {
      return Meteor.user().gifteeId == player._id ? "list-group-item-success" : "";
    } else {
      return "";
    }
  },
  inLinks: function() {
    var inLinksUsers = Meteor.users.find({"significantId": "" + this._id}).fetch();
    inLinksUsernames = _.pluck(inLinksUsers, 'username');
    if (inLinksUsernames.length > 0) {
      return inLinksUsernames.join(' ');
    } else {
      return false;
    }
  },
  isCurrentPlayer: function() {
    return Meteor.userId() == "" + this._id;
  },
  remainingCount: remainingCount
});
