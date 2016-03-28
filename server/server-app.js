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

var swapArrayElements = function(arr, indexA, indexB) {
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};

function randomSortGiftees(players) {
  var clonedPlayers = JSON.parse(JSON.stringify(players));
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
        username: 1,
        single: 1
      }
    }), UserStatus.connections.find()
  ];
});

printUsernames = function (arr) {
  for (i = 0; i < arr.length; i++) {
    console.log(arr[i].username, ', ');
  }
  console.log()
}

Meteor.methods({
  setSingle: function (single) {
    console.log('single', single);
    Meteor.users.update(this.userId, {
      $set: {
        single: single
      }
    });
  },
  matchSantas: function () {
    var players = Meteor.users.find().fetch();
    var giftees = randomSortGiftees(players);
    printUsernames(players);
    printUsernames(giftees);
    for (i = 0; i < players.length; i++) {
      if (players[i]._id === giftees[i]._id) {
        // swap it with the last
        console.log("> ERROR: self-santa!", players[i].username, i);
        if (i < giftees.length - 1) {
          swapArrayElements(giftees, i, giftees.length - 1);
        } else {
          swapArrayElements(giftees, 1, giftees.length - 1);
        }
      }
    }

    printUsernames(giftees);

    for (i = 0; i < players.length; i++) {
      // can't pick yourself, ensure gifteeId is not player's _id
      giftee = giftees.shift();
      Meteor.users.update(players[i]._id, {
        $set: {
          gifteeId: giftee._id
        }
      });
      console.log(players[i].username, "gifts", (Meteor.users.findOne({_id: giftee._id})) ? Meteor.users.findOne({_id: giftee._id}).username : "");
    }
  }
});
