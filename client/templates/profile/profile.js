Template.Profile.events({
  "click a": function (event, template) {
    event.preventDefault();
    var username = template.find(event.currentTarget).id;
    var significant = Meteor.users.findOne({username: username});
    Meteor.call("setSignificant", significant);
  }
});

Template.Profile.helpers({
  active: function() {
    return Meteor.user().significantId ? "" : "active";
  },
  players: function() {
    return Meteor.users.find({}, {sort: { username: 1 }}).fetch();
  }
});
