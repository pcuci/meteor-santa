export function getAdjacencyMatrix(players) {
  var matrix = [];
  // Create all possible edges
  var colHeader = "";
  for (var col = 0; col < players.length; col++) {
    colHeader += players[col].username + " ";
  }
  // console.log(colHeader);
  for (var row = 0; row < players.length; row++) {
    var rowData = [];
    for (var col = 0; col < players.length; col++) {
      var weight = 0;
      if ((players[row].username === players[col].username) || players[row].sweetheart === players[col].username) {
        weight = 1;
      }
      rowData.push({x: players[row].username, y: players[col].username, weight: weight});
    }
    // console.log(players[row].username, "\t", _.pluck(rowData, 'weight'));
    matrix.push(rowData);
  }
  return matrix;
}

export function isSymetric(matrix) {
  for (var row = 0; row < matrix.length; row++) {
    for (var col = row; col < matrix[0].length; col++) {
      if (matrix[row][col].weight != matrix[col][row].weight) {
        return false;
      }
    }
  }
  return true;
}
