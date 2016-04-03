import {getAdjacencyMatrix, isSymetric} from "../../../utils";

Template.Match.helpers({
  users: function() {
    return Meteor.users.find();
  },
  matchesExist: function() {
    return Meteor.users.findOne({gifteeId: {$exists: true}});
  },
  isMatchReady: function() {
    // Ensure everyone has declared their better halfs
    var isMatchReady = isSymetric(getAdjacencyMatrix(Meteor.users.find().fetch()));
    return isMatchReady;
  }
});

Template.Match.events({
  "click button[type=submit]": function(e, tmpl) {
    e.preventDefault();
    Meteor.call("matchSantas");
  },
  "click button[type=reset]": function(e, tmpl) {
    e.preventDefault();
    Meteor.call("clearSantas");
  }
});
