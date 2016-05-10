var Board = require("./board");
var MoveError = require("./moveError");

function Game () {
  this.board = new Board();
}

Game.prototype.isOver = function () {
  return this.board.isOver();
};

Game.prototype.playMove = function (pos) {

};

Game.prototype.run = function (reader, gameCompletionCallback) {

};


module.exports = Game;
