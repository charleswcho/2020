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
