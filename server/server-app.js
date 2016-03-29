var swapArrayElements = function(arr, indexA, indexB) {
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};

function printMatrix(players) {
  var matrix = [];
  // Create all possible edges
  var colHeader = "";
  for (var col = 0; col < players.length; col++) {
    colHeader += players[col].username + " ";
  }
  console.log(colHeader);
  for (var row = 0; row < players.length; row++) {
    var rowData = [];
    for (var col = 0; col < players.length; col++) {
      var weight = 0;
      if ((players[row].username === players[col].username) || players[row].sweetheart === players[col].username) {
        weight = 1;
      }
      rowData.push({x: players[row].username, y: players[col].username, weight: weight});
    }
    console.log(players[row].username, "\t", _.pluck(rowData, 'weight'));
    matrix.push(rowData);
  }
  return matrix;
}

function isSymetric(matrix) {
  for (var row = 0; row < matrix.length; row++) {
    for (var col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col].weight != matrix[col][row].weight) {
        return false;
      }
    }
  }
  return true;
}

function randomSortGiftees(players) {
  var clonedPlayers = JSON.parse(JSON.stringify(players));
  var shuffeledGiftees = _.shuffle(clonedPlayers);
  _.each(shuffeledGiftees, function(giftee) {
    console.log(giftee.username, "♡ ", giftee.sweetheart);
  });
  var matrix = printMatrix(shuffeledGiftees);

  console.log("Symetric?", isSymetric(matrix));

  // In the worst case scenario we have 2 couples at the tail of both lists
  if (players.length < 4) {
    throw new Meteor.Error(400, "Matching failed. For paired plays, we need at least 4 people playing.");
  }
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
        sweetheart: 1,
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
    Meteor.users.update(this.userId, {
      $set: {
        single: single
      }
    });
  },
  setSweetheart: function (username) {
    if (Meteor.user() && (Meteor.user().username == username))
      throw new Meteor.Error(400, "You can't be your own santa!");
    Meteor.users.update(this.userId, {
      $set: {
        sweetheart: username
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
      console.log(players[i].username, "🎅 ", (Meteor.users.findOne({_id: giftee._id})) ? Meteor.users.findOne({_id: giftee._id}).username : "");
    }
  }
});
