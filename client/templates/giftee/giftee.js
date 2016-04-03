Template.Giftee.helpers({
  giftee: function() {
    if (Meteor.user() && Meteor.user().gifteeId) {
      return Meteor.users.findOne({_id: Meteor.user().gifteeId});
    } else {
      return null;
    }
  }
});
