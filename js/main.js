var View = require('./lib/view');
var Game = require('./lib/game');

document.addEventListener("DOMContentLoaded", function(event) {
  var rootEl = $('.2020');
  var game = new Game();
  window.view = new View(game, rootEl);
});
