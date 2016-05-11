var Shape = require('./shape');

function Tray () {
  this.grid = Tray.makeGrid();
  this.shape = new Shape();
  this.placePiece(this.shape);
}

Tray.makeGrid = function () {
  var grid = [];
  for (var i = 0; i < 5; i++) {
    grid.push([]);
    for (var j = 0; j < 5; j++) {
      grid[i].push(null);
    }
  }
  return grid;
};

Tray.prototype.placePiece = function (shape) {
  shape.coords.forEach(function (pos) {
    this.grid[pos[0]][pos[1]] = shape.color;
  }.bind(this));
};

module.exports = Tray;
