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

function fillSums(matrix) {
  for (var row = 0; row < matrix.length; row++) {
    var sum = 0;
    for (var col = 0; col < matrix[0].length; col++) {
      sum += matrix[row][col].weight;
    }
    for (var col = 0; col < matrix[0].length; col++) {
      matrix[row][col].sum = sum;
    }
  }
  if (matrix[0][0].sum > 2) {
    throw new Meteor.Error(400, "This version of Secret Santa supports only pair-wise restrictions: " + matrix[0][0].x + " has more than one lovers.");
  }
}

function sortMatrixRowsByOutdegree(matrix) {
  fillSums(matrix);
  return _.sortBy(matrix, function(row) {
    return -row[0].sum;
  });
}

function longestPathLength(matrix) {
  var longestPath = 0;
  for (var row = 0; row < matrix.length; row++) {
    for (var col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col].weight == 2) {
        longestPath++;
      }
    }
  }
  return longestPath;
}

function solve(matrix, lastTry) {
  var m = JSON.parse(JSON.stringify(matrix));

  // Assume the topologically ordered matrix is solvable
  for (var row = 0; row < m.length; row++) {
    for (var col = 0; col < m[0].length; col++) {
      // Find first connection option
      if (m[row][col].weight == 0 && !m[row][col].used) {
        m[row][col].weight = 2;
        // Mark entire column used
        for (var innerRow = row; innerRow < m.length; innerRow++) {
          m[innerRow][col].used = true;
        }
        break;
      }
    }
  }

  var longestPath = longestPathLength(m);
  if (!lastTry && longestPath < m.length) {
    // Reorder the last 2 nodes to continue the cycle
    console.log("longest path:", longestPath);
    var lastRow = matrix.pop();
    var secondLastRow = matrix.pop();
    matrix.push(lastRow);
    matrix.push(secondLastRow);
    // Retry only once, one flip of the last two rows
    return solve(matrix, true);
  } else {
    console.log("longest path (else):", longestPath);
    return m;
  }
}

function printSolution(matrix) {
  for (var row = 0; row < matrix.length; row++) {
    for (var col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col].weight == 2) {
        console.log(matrix[row][col].x, "->", matrix[row][col].y);
      }
    }
  }
}

function extractMatches(matrix) {
  var matches = [];
  for (var row = 0; row < matrix.length; row++) {
    for (var col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col].weight == 2) {
        matches.push({
          santaUsername: matrix[row][col].x,
          gifteeUsername: matrix[row][col].y
        });
      }
    }
  }
  return matches;
}

function findMatches(players) {
  var clonedPlayers = JSON.parse(JSON.stringify(players));
  var shuffeledGiftees = _.shuffle(clonedPlayers);
  _.each(shuffeledGiftees, function(giftee) {
    console.log(giftee.username, "♡ ", giftee.sweetheart);
  });
  var matrix = printMatrix(shuffeledGiftees);

  console.log("Symetric?", isSymetric(matrix));
  console.log(matrix);
  matrix = sortMatrixRowsByOutdegree(matrix);
  console.log("Sorted:");
  console.log(matrix);
  matrix = solve(matrix);
  console.log("Solved:");
  console.log(matrix);
  printSolution(matrix);
  return extractMatches(matrix);
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
    var matches = findMatches(players);
    console.log("matches:", matches);
    _.each(matches, function(match) {
      var santa = Meteor.users.findOne({username: match.santaUsername});
      var giftee = Meteor.users.findOne({username: match.gifteeUsername});
      Meteor.users.update(santa._id, {
        $set: {
          gifteeId: giftee._id
        }
      });
    });
  }
});
