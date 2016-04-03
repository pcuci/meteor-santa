Template.Login.helpers({
  loggedIn: function() {
    return Meteor.userId();
  }
});

Template.Login.events({
  "submit form": function(e, tmpl) {
    var input;
    e.preventDefault();
    input = tmpl.find("input[name=username]");
    input.blur();
    return Meteor.insecureUserLogin(input.value, function(err, res) {
      if (err) {
        return console.log(err);
      }
    });
  }
});
