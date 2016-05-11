var Board = require("./board");
var Tray = require("./tray");
var MoveError = require("./moveError");

function Game () {
  this.board = new Board();
  this.tray = new Tray();
}

Game.prototype.isOver = function () {
  return this.board.isOver();
};

Game.prototype.playMove = function () {
  this.board.placeShape(this.tray.shape); 
  this.tray = new Tray();
};

Game.prototype.run = function (gameCompletionCallback) {

};


module.exports = Game;
