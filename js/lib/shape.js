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
