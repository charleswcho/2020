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
	  this.$el.on("click", "li", (function (e) {
	    console.log($(e.currentTarget).data('pos'));
	    console.log($(e.currentTarget).data('color'));
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
	};
	
	View.prototype.validMove = function (startPos) {
	  var shape = this.game.tray.shape;
	  var coords = shape.coords;
	  console.log(coords);
	  var transformedCoords = coords.map(function (pos) {
	    return [startPos[0]+pos[0], startPos[1]+pos[1]];
	  });
	  console.log(transformedCoords);
	};
	
	View.prototype.setupBoard = function () {
	  var self = this;
	  var $ul = $("<ul>");
	  $ul.addClass("group");
	
	  for (var rowIdx = 0; rowIdx < 10; rowIdx++) {
	    for (var colIdx = 0; colIdx < 10; colIdx++) {
	      var $li = $("<li>");
	      $li.data("pos", [rowIdx, colIdx]);
	      $li.droppable({
	        tolerance: 'pointer',
	        drop: function (e, ui) {
	          debugger;
	          if (self.validMove($(this).data('pos'))) {
	
	
	          } else {
	
	          }
	
	          $(this).css("background", $(ui.draggable[0]).data('color'));
	          self.game.playMove();
	          self.setupPieceTray();
	        },
	      });
	      $ul.append($li);
	    }
	  }
	
	  this.$el.append($ul);
	};
	
	View.prototype.setupPieceTray = function () {
	  $('.tray').remove();
	  var tray = this.game.tray;
	  var $ul = $("<ul>");
	  $ul.addClass("tray");
	
	  tray.grid.forEach(function (row, rowIdx) {
	    row.forEach(function (col, colIdx) {
	      var $li = $("<li>");
	      if (col !== null) {
	        $li.data("color", col);
	        $li.addClass("piece");
	        $li.css('background', col);
	      }
	
	      $li.data("pos", [rowIdx, colIdx]);
	      $ul.append($li);
	    });
	  });
	
	  this.$el.append($ul);
	  this.addDraggableListener();
	};
	
	View.prototype.addDraggableListener = function () {
	  $('.tray > li.piece').draggable({
	    cursor: 'pointer',
	    revert: false,
	    helper: function(e) {
	      var helperList = $('<ul class="draggable-helper">');
	      helperList.append($('.tray > li').clone());
	      return helperList;
	    },
	    drag: function (e, ui) {
	      $('.tray > li.piece').css('visibility', 'hidden');
	    },
	
	    stop: function(e, ui) {
	      $('.tray > li.piece').css('visibility', 'visible');
			},
	    cursorAt: { top: 40 }
	  });
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var Tray = __webpack_require__(5);
	var MoveError = __webpack_require__(4);
	
	function Game () {
	  this.board = new Board();
	  this.tray = new Tray();
	}
	
	Game.prototype.isOver = function () {
	  return this.board.isOver();
	};
	
	Game.prototype.playMove = function () {
	  this.tray = new Tray();
	};
	
	Game.prototype.run = function (gameCompletionCallback) {
	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(6);
	
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


/***/ },
/* 6 */
/***/ function(module, exports) {

	Array.prototype.random = function () {
	  return this[Math.floor(Math.random() * this.length)];
	}
	
	var SHAPES = ['dot', 'sSquare', 'lSquare',
	  'horizontal2', 'horizontal3', 'horizontal4', 'horizontal5',
	  'vertical2', 'vertical3', 'vertical4', 'vertical5'
	];
	
	var COLORS = ['green', 'lightblue', 'blue', 'purple', 'red', 'yellow', 'lightgreen'];
	
	function Shape () {
		this.type = SHAPES.random();
		this.color = COLORS.random();
		this.render();
	};
	
	Shape.prototype.render = function() {
	  switch (this.type) {
	    case 'dot':
	      this.coords = [[0,0]];
	      break;
	    case 'sSquare':
	      this.coords = [[0,0], [0,1], [1,0], [1,1]];
	      break;
	    case 'lSquare':
	      this.coords = [[0,0], [1,0], [2,0], [0,1], [1,1], [2,1], [0,2], [1,2], [2,2]];
	      break;
	    case 'horizontal2':
	      this.coords = [[0,0], [1,0]];
	      break;
	    case 'horizontal3':
	      this.coords = [[0,0], [1,0], [2,0]];
	      break;
	    case 'horizontal4':
	      this.coords = [[0,0], [1,0], [2,0], [3,0]];
	      break;
	    case 'horizontal5':
	      this.coords = [[0,0], [1,0], [2,0], [3,0], [4,0]];
	      break;
	    case 'vertical2':
	      this.coords = [[0,0], [0,1]];
	      break;
	    case 'vertical3':
	      this.coords = [[0,0], [0,1], [0,2]];
	      break;
	    case 'vertical4':
	      this.coords = [[0,0], [0,1], [0,2], [0,3]];
	      break;
	    case 'vertical5':
	      this.coords = [[0,0], [0,1], [0,2], [0,3], [0,4]];
	      break;
	  }
	};
	
	module.exports = Shape;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map