export function remainingCount() {
  count = Meteor.users.find().count();
  return count >= 4 ? false : 4 - count;
}

Template.Requirements.helpers({
  remainingCount: remainingCount,
  oneLeft: function() {
    return (remainingCount() == 1) ? true : false;
  }
});
