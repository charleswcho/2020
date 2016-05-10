/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Game = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(event) {
	  var rootEl = $('.2020');
	  var game = new Game();
	  window.view = new View(game, rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	var View = function (game, $el) {
	    this.game = game;
	    this.$el = $el;
	
	    this.setupBoard();
	    this.setupPieceTray();
	    this.bindEvents();
	  };
	
	View.prototype.bindEvents = function () {
	  // install a handler on the `li` elements inside the board.
	  this.$el.on("click", "li", (function (event) {
	    console.log($(event.currentTarget).data('pos'));
	  }).bind(this));
	};
	
	View.prototype.makeMove = function ($square) {
	  var pos = $square.data("pos");
	  var currentPlayer = this.game.currentPlayer;
	
	  try {
	    this.game.playMove(pos);
	  } catch (e) {
	    alert("Invalid move! Try again.");
	    return;
	  }
	
	  $square.addClass(currentPlayer);
	
	  if (this.game.isOver()) {
	    // cleanup click handlers.
	    this.$el.off("click");
	    this.$el.addClass("game-over");
	
	    var winner = this.game.winner();
	    var $figcaption = $("<figcaption>");
	
	    if (winner) {
	      this.$el.addClass("winner-" + winner);
	      $figcaption.html("You win, " + winner + "!");
	    } else {
	      $figcaption.html("It's a draw!");
	    }
	
	    this.$el.append($figcaption);
	  }
	};
	
	View.prototype.setupBoard = function () {
	  var $ul = $("<ul>");
	  $ul.addClass("group");
	
	  for (var rowIdx = 0; rowIdx < 10; rowIdx++) {
	    for (var colIdx = 0; colIdx < 10; colIdx++) {
	      var $li = $("<li>");
	      $li.data("pos", [rowIdx, colIdx]);
	      $li.droppable({
	        drop: function(event, ui) {
	          console.log($(this).data('pos'))
	          $(this).addClass('piece');
	          $(this).css("background", $(ui.draggable[0]).data('color'));
	        }
	      });
	      $ul.append($li);
	    }
	  }
	
	  this.$el.append($ul);
	};
	
	View.prototype.setupPieceTray = function () {
	  var $ul = $("<ul>");
	  $ul.addClass("group");
	
	  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
	    for (var colIdx = 0; colIdx < 10; colIdx++) {
	      var $li = $("<li>");
	      $li.data("pos", [rowIdx, colIdx]);
	      if (rowIdx === 0) {
	        $li.data('color', 'blue');
	        $li.draggable({
	          stop: function (event, ui) {
	            $(this).remove();
	          }
	        });
	      }
	      $ul.append($li);
	    }
	  }
	
	  this.$el.append($ul);
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var MoveError = __webpack_require__(4);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(4);
	
	function Board () {
	  this.grid = Board.makeGrid();
	}
	
	Board.isValidPos = function (pos) {
	  return (
	    (0 <= pos[0]) && (pos[0] < 10) && (0 <= pos[1]) && (pos[1] < 10)
	  );
	};
	
	Board.makeGrid = function () {
	  var grid = [];
	
	  for (var i = 0; i < 10; i++) {
	    grid.push([]);
	    for (var j = 0; j < 10; j++) {
	      grid[i].push(null);
	    }
	  }
	
	  return grid;
	};
	
	
	Board.prototype.placeMark = function (pos, mark) {
	  if (!this.isEmptyPos(pos)) {
	    throw new MoveError("Is not an empty position!");
	  }
	
	  this.grid[pos[0]][pos[1]] = mark;
	};
	
	
	Board.prototype.isEmptyPos = function (pos) {
	  if (!Board.isValidPos(pos)) {
	    throw new MoveError("Is not valid position!");
	  }
	
	  return (this.grid[pos[0]][pos[1]] === null);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}
	
	module.exports = MoveError;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map