import {getAdjacencyMatrix, isSymetric} from "../../../utils";
import {remainingCount} from "../requirements/requirements.js";

Template.Match.events({
  "click button[type=submit]": function(event, template) {
    event.preventDefault();
    Meteor.call("matchSantas");
  },
  "click button[type=reset]": function(event, template) {
    event.preventDefault();
    Meteor.call("clearSantas");
  }
});

Template.Match.helpers({
  users: function() {
    return Meteor.users.find();
  },
  existingMatches: function() {
    return Meteor.users.findOne({gifteeId: {$exists: true}});
  },
  matchable: function() {
    // Ensure everyone has declared their better halfs
    var isMatchReady = isSymetric(getAdjacencyMatrix(Meteor.users.find().fetch()));
    return isMatchReady;
  },
  remainingCount: remainingCount
});
