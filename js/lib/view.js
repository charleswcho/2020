var View = function (game, $el) {
  this.game = game;
  this.$el = $el;
  this.valid = true;

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

View.prototype.transformCoords = function (startPos, coords) {
  this.transformedCoords = coords.map(function (pos) {
    return [startPos[0]+pos[0], startPos[1]+pos[1]];
  });
};

View.prototype.validMove = function (startPos) {
  var coords = this.game.tray.shape.coords;
  this.transformCoords(startPos, coords);
  this.transformedCoords.forEach(function (pos) {
    $('.group > li.piece').each(function (idx, li) {
      var $li = $(li);
      if (($li.data('pos').equals(pos)) && ($li.data('color') !== null)) {
        this.valid = false;
      }
    });
  });
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
          this.valid = self.validMove($(this).data('pos'));

          if (this.validMove) {
            $(this).css('background', $(ui.draggable[0]).data('color'));
            $(this).data('color', $(ui.draggable[0]).data('color'));
            $(this).addClass('piece')
            self.game.playMove();
            self.setupPieceTray();
          } else {

          }


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
