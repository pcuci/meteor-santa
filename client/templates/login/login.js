Template.Login.helpers({
  loggedIn: function() {
    return Meteor.userId();
  }
});

Template.Login.events({
  "submit form": function(event, template) {
    var input;
    event.preventDefault();
    input = template.find("input[name=username]");
    input.blur();
    return Meteor.insecureUserLogin(input.value, function(err, res) {
      if (err) {
        return console.log(err);
      }
    });
  }
});
