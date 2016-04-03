Template.Profile.helpers({
  single: function() {
    if (Meteor.user()) {
      if (Meteor.user().single) {
        return 'checked';
      } else {
        return '';
      }
    }
    return '';
  },
  conjoint: function() {
    if (Meteor.user()) {
      if (Meteor.user().single) {
        return '';
      } else {
        return 'checked';
      }
    }
    return '';
  },
  isConjoint: function() {
    return (Meteor.user()) ? !Meteor.user().single : false;
  }
});

Template.Profile.events({
  'change input[type=radio]': function (event, template) {
    single = template.find('input:radio[name=single]:checked').value;
    Meteor.call("setSingle", (single == "true"));
    Meteor.call("setSweetheart", undefined);
  }
});
