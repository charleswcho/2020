var View = function (game, $el) {
  this.game = game;
  this.board = game.board;
  this.$el = $el;
  this.valid = true;
  this.grid = [];
  this.setupBoard();
  this.setupPieceTray();
};

View.prototype.setupBoard = function () {
  var self = this;
  var $ul = $("<ul>").addClass("group");

  this.board.grid.forEach(function (row, rowIdx) {
    row.forEach(function (tile, tileIdx) {
      var $li = $("<li>");
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
      self.valid = true;
      self.listItems = [];
      self.validMove($(this).data('pos'));
      if (self.valid) {
        self.renderFullShape($(ui.draggable[0]).data('color'));
        self.placeShape();
      }
    },
  });
};

View.prototype.placeShape = function (listItem) {
  this.game.playMove();
  this.setupPieceTray();
  this.game.score += 7
  $('.score').html('<p>Score: ' + this.game.score + '</p>');
};

View.prototype.transformCoords = function (startPos, coords) {
  this.transformedCoords = coords.map(function (pos) {
    return [startPos[0]+pos[0], startPos[1]+pos[1]];
  });
};

View.prototype.renderFullShape = function (color) {
  this.listItems.forEach(function ($li) {
    $li.css('background', color);
    $li.data('color', color);
    $li.addClass('piece')
  });
  this.horizontals();
  this.verticals();
};

View.prototype.validMove = function (startPos) {
  var self = this;
  var coords = this.game.tray.shape.coords;
  this.transformCoords(startPos, coords);
  this.transformedCoords.forEach(function (pos) {
    $('.group > li').each(function (idx, li) {
      var $li = $(li);
      if (($li.data('pos').equals(pos)) && ($li.data('color') !== undefined)) {
        self.valid = false;
      } else if ($li.data('pos').equals(pos)) {
        self.listItems.push($li);
      }
    });
  });
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

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
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
