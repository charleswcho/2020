var Shape = require('./shape');
var Tile = require('./tile');
var NullTile = require('./nullTile');

function Tray () {
  this.grid = Tray.makeGrid();
  this.shape = new Shape();
  this.placeShape(this.shape);
}

Tray.makeGrid = function () {
  var grid = [];
  for (var i = 0; i < 5; i++) {
    grid.push([]);
    for (var j = 0; j < 5; j++) {
      grid[i].push(new NullTile([i,j], null));
    }
  }
  return grid;
};

Tray.prototype.placeShape = function (shape) {
  shape.coords.forEach(function (pos) {
    this.grid[pos[0]][pos[1]] = new Tile(pos, shape.color);
  }.bind(this));
};

module.exports = Tray;
