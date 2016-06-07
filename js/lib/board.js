var MoveError = require("./moveError");
var Tile = require('./tile');
var NullTile = require('./nullTile');

function Board () {
  this.grid = Board.makeGrid();
}

Board.makeGrid = function () {
  var grid = [];
  for (var i = 0; i < 10; i++) {
    grid.push([]);
    for (var j = 0; j < 10; j++) {
      grid[i].push(new NullTile([i,j], null));
    }
  }
  return grid;
};

Board.validPos = function (pos) {
  return (
    (0 <= pos[0]) && (pos[0] < 10) && (0 <= pos[1]) && (pos[1] < 10)
  );
};

Board.prototype.placeShape = function (startPos, shape) {
  var self = this;
  var coords = shape.coords;

  var transformedCoords = coords.map(function (pos) {
    return [startPos[0]+pos[0], startPos[1]+pos[1]];
  });

  if (this.emptyCoords(transformedCoords)) {
    transformedCoords.forEach(function (coord) {
      self.grid[coord[0]][coord[1]] = new Tile(coord, shape.color);
    });
  }
};

Board.prototype.emptyCoords = function (coords) {
  var self = this;
  var isValid = coords.every(Board.validPos);
  var isEmpty = false;
  if (isValid) {
    isEmpty = coords.every(function (coord, idx, arr) {
      var tile = self.grid[coord[0]][coord[1]]
      return tile.empty
    });
  }

  return isValid && isEmpty;
};

Board.prototype.verticals = function () {
  var self = this;
  var grid = this.grid;
  var cols = grid[0].map(function(col, i) {
    return grid.map(function(row) {
        return row[i];
    });
  });
  cols.forEach(function (row) {
    if (self.full(row)) {
      self.clear(row);
    }
  });
};

Board.prototype.horizontals = function () {
  var grid = this.grid;
  var self = this;
  var row = [];
  $('.group > li').each(function (idx, li) {
    var $li = $(li);
    row.push($li[0]);
    if (row.length === 10) {
      if (self.full(row)) {
        self.clear(row);
      }
      self.grid.push(row);
      row = [];
    }
  });
};

Board.prototype.full = function (arr) {
  var full = true;
  arr.forEach(function (li) {
    var $li = $(li);
    if ($li.data('color') === undefined) {
      full = false;
    }
  });
  return full;
};

Board.prototype.clear = function (arr) {
  this.game.score += 93
  var self = this;
  arr.forEach(function (li) {
    var $li = $(li);
    $li.animate({ 'background-color': '#ccc' }, 500, function() {
      $li.removeAttr('style');
      $li.removeData('color');
      $li.removeClass('piece');
		});
  });

  return true;
};

Board.prototype.isOver = function () {
  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
    for (var colIdx = 0; colIdx < 3; colIdx++) {
      if (this.isEmptyPos([rowIdx, colIdx])) {
        return false;
      }
    }
  }
  return true;
};

module.exports = Board;
