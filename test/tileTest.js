(function() {
  'use strict';
  TestRunner.describe('tile test', {
    setup: function() {
      console.log('ran before each test');
    },
    'it creates  a tile object': function() {
      return true;
    }
  });

  var tile;
  TestRunner.describe('tile #calculateAverageColor', {
    setup: function() {
      tile = new Tile({
        data: [33, 33, 33]
      });
    },
    'it should return a array with the average rgb color if all the values are the same': function() {
      var average = tile.calculateAverageColor();

      var isEqual = true;
      isEqual = isEqual && average[0] === 33;
      isEqual = isEqual && average[1] === 33;
      isEqual = isEqual && average[2] === 33;

      return isEqual;
    },
    'it should return a array with the average rgb over several values': function() {
      tile = new Tile({
        data: [3, 3, 3, 1, 5, 13]
      });
      var average = tile.calculateAverageColor();

      var isEqual = true;
      isEqual = isEqual && average[0] === 2;
      isEqual = isEqual && average[1] === 4;
      isEqual = isEqual && average[2] === 8;

      return isEqual;
    }
  });

  TestRunner.describe('tile #getTile', {
    setup: function() {
      tile = new Tile({
        data: [33, 33, 33]
      });
    },
    'it returns a promise': function() {
      var promise = tile.get();

      return (typeof promise.then) === 'function';
    }
  });



})();
