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
	  this.board = game.board;
	  this.$el = $el;
	  this.grid = [];
	  this.setupBoard();
	  this.setupPieceTray();
	};
	
	View.prototype.setupBoard = function () {
	  var self = this;
	  $('.group').remove();
	  var $ul = $("<ul>").addClass("group");
	
	  this.board.grid.forEach(function (row, rowIdx) {
	    row.forEach(function (tile, tileIdx) {
	      var $li = $("<li>");
	      if (!tile.empty) {
	        $li.css('background', tile.color);
	        $li.data('color', tile.color);
	        $li.addClass('piece')
	      }
	      $li.data("pos", [rowIdx, tileIdx]);
	      self.addDroppableListener($li);
	      $ul.append($li);
	    });
	  });
	
	  this.$el.append($ul);
	};
	
	View.prototype.addDroppableListener = function ($li) {
	  var self = this;
	  $li.droppable({
	    tolerance: 'pointer',
	    drop: function (e, ui) {
	      self.placeShape($(this).data('pos'))
	    },
	  });
	};
	
	View.prototype.placeShape = function (startPos) {
	  this.game.playMove(startPos);
	  this.setupBoard();
	  this.setupPieceTray();
	  this.horizontals();
	  this.verticals();
	  this.game.score += 7
	  $('.score').html('<p>Score: ' + this.game.score + '</p>');
	};
	
	View.prototype.verticals = function () {
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
	
	View.prototype.horizontals = function () {
	  this.grid = [];
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
	
	View.prototype.full = function (arr) {
	  var full = true;
	  arr.forEach(function (li) {
	    var $li = $(li);
	    if ($li.data('color') === undefined) {
	      full = false;
	    }
	  });
	  return full;
	};
	
	View.prototype.clear = function (arr) {
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
	
	View.prototype.setupPieceTray = function () {
	  var self = this;
	  $('.tray').remove();
	  var tray = this.game.tray;
	  var $ul = $("<ul>");
	  $ul.addClass("tray");
	
	  tray.grid.forEach(function (row, rowIdx) {
	    row.forEach(function (tile, tileIdx) {
	      var $li = $("<li>");
	      if (!tile.empty) {
	        $li.data("color", tile.color);
	        $li.css('background', tile.color);
	        $li.addClass("piece");
	      }
	
	      $li.data("pos", [rowIdx, tileIdx]);
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
	      if (!this.validMove) {
	        $('.tray > li.piece').css('visibility', 'visible');
	      }
			},
	    cursorAt: { top: 40 }
	  });
	};
	
	Array.prototype.equals = function (array) {
	  if (!array)
	      return false;
	  if (this.length != array.length)
	      return false;
	  for (var i = 0, l=this.length; i < l; i++) {
	      if (this[i] instanceof Array && array[i] instanceof Array) {
	          if (!this[i].equals(array[i]))
	              return false;
	      }
	      else if (this[i] != array[i]) {
	          return false;
	      }
	  }
	  return true;
	}
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var Tray = __webpack_require__(7);
	var MoveError = __webpack_require__(4);
	
	function Game () {
	  this.board = new Board();
	  this.tray = new Tray();
	  this.score = 0;
	}
	
	Game.prototype.isOver = function () {
	  return this.board.isOver();
	};
	
	Game.prototype.playMove = function (pos) {
	  this.board.placeShape(pos, this.tray.shape);
	  this.tray = new Tray();
	};
	
	Game.prototype.run = function (gameCompletionCallback) {
	
	};
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(4);
	var Tile = __webpack_require__(5);
	var NullTile = __webpack_require__(6);
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}
	
	module.exports = MoveError;


/***/ },
/* 5 */
/***/ function(module, exports) {

	function Tile (pos, color) {
	  this.pos = pos;
	  this.color = color;
	  this.empty = false;
	};
	
	module.exports = Tile;


/***/ },
/* 6 */
/***/ function(module, exports) {

	function NullTile (pos, color) {
	  this.pos = pos;
	  this.color = color;
	  this.empty = true;
	};
	
	module.exports = NullTile;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(8);
	var Tile = __webpack_require__(5);
	var NullTile = __webpack_require__(6);
	
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	Array.prototype.random = function () {
	  return this[Math.floor(Math.random() * this.length)];
	}
	
	var SHAPES = ['dot', 'sSquare', 'lSquare','lelbow3', 'lelbow5', 'relbow3', 'relbow5','horizontal2', 'horizontal3', 'horizontal4', 'horizontal5',
	  'vertical2', 'vertical3', 'vertical4', 'vertical5'
	];
	
	var COLORS = ['#FFB5E8', '#FF9CEE', '#F6A6FF', '#B28DFF', '#C5A3FF', '#D5AAFF', '#B5B9FF', '#AFCBFF', '#AFF8DB', '#85E3FF', '#ACE7FF', '#6EB5FF', '#BFFCC6', '#E7FFAC', '#FFC9DE', '#FFBEBC', '#FFABAB', '#FFF5BA'];
	
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
	    case 'lelbow3':
	      this.coords = [[0,0], [1,0], [1,1]];
	      break;
	    case 'lelbow5':
	      this.coords = [[0,0], [1,0], [2,0], [2,1], [2,2]];
	      break;
	    case 'relbow3':
	      this.coords = [[0,0], [0,1], [1,1]];
	      break;
	    case 'relbow5':
	      this.coords = [[0,0], [0,1], [0,2], [1,2], [2,2]];
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