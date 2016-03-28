import $ from "jquery";

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

function randomSortGiftees(players) {
  var clonedPlayers = jQuery.extend(true, {}, originalObject);
  shuffeledGiftees = shuffleArray(clonedPlayers);
  return shuffeledGiftees;
}

process.env.HTTP_FORWARDED_COUNT = 1;
Meteor.publish(null, function() {
  return [
    Meteor.users.find({
      "status.online": true
    }, {
      fields: {
        status: 1,
        gifteeId: 1,
        username: 1
      }
    }), UserStatus.connections.find()
  ];
});

Meteor.methods({
  matchSantas: function (taskId, setChecked) {
    var players = Meteor.users.find().fetch();
    var giftees = randomSortGiftees(players);
    _.each(players, function(player) {
      // can't pick yourself, ensure gifteeId is not player's _id
      giftee = giftees.shift();
      Meteor.users.update(player._id, {
        $set: {
          gifteeId: giftee._id
        }
      });
      console.log(player.username, "gifts", (Meteor.users.findOne({_id: giftee._id})) ? Meteor.users.findOne({_id: giftee._id}).username : "");
    });
  }
});
