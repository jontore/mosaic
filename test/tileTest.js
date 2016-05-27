(function() {
  'use strict';
  var SVGFIXTURE = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"> '
    + '<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#EEFFDD"></ellipse>'
    + '</svg>';

  var blobFixture = new Blob([SVGFIXTURE], {type : 'image/svg+xml'});

  var tile;
  TestRunner.describe('tile #calculateAverageColor', {
    setup: function() {
      tile = new Tile({
        data: [33, 33, 33, 0]
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
        data: [3, 3, 3, 0, 1, 5, 13, 180]
      });
      var average = tile.calculateAverageColor();

      var isEqual = true;
      isEqual = isEqual && average[0] === 2;
      isEqual = isEqual && average[1] === 4;
      isEqual = isEqual && average[2] === 8;

      return isEqual;
    },
    'it should support hex average color': function() {
      var average = tile.calculateAverageColor('hex');
      return average === '212121';
    },
    'it should round up to a whole number integer': function() {
      tile = new Tile({
        data: [3.1, 3.7, 3.5, 0]
      });
      var average = tile.calculateAverageColor();

      return average[0] === 4
        && average[1] === 4
        && average[2] === 4;
    },
    'it should support hex average color with two digets': function() {
      tile = new Tile({
        data: [255, 231, 0, 12]
      });
      var average = tile.calculateAverageColor('hex');
      return average === 'ffe700';
    }
  });

  TestRunner.describe('tile #getTile', {
    setup: function() {
      tile = new Tile({
        data: [255, 238, 221, 0]
      });
    },
    'it should fetch the tile using the average color': function() {
      var isCorrectURL = false;
      tile._fetch = function(url) {
        isCorrectURL = url === '/color/ffeedd';
        return new Promise(function() {});
      };

      tile.get();

      return isCorrectURL;
    },
    'it should set fetched tile as svgTile': function() {
      tile._fetch = function() {
        return new Promise(function(resolve) {
          resolve({
            blob: function() { return blobFixture; }
          });
        });
      };
      return new Promise(function(resolve, reject) {
        tile.get().then(function() {
          tile.svgTile.outerHTML.indexOf('<img src="blob:') === 0 ? resolve() : reject('fetched tile as svgTile');
        });
      });
    }
  });

  var renderTile;
  TestRunner.describe('tile #render', {
    setup: function() {
      renderTile = new Tile({
        data: [255, 238, 221]
      });

      renderTile.svgTile = document.createElement('img');
    },
    'it should render tile into a row element': function() {
      return new Promise(function(resolve, reject) {
        renderTile.render().then(function(output) {
          (output.outerHTML.indexOf('<td>') === 0) && (output.querySelectorAll('img').length === 1) ? resolve() : reject();
        });
      });
    },
    'it should get the svg tile if it has not been set': function() {
      renderTile.svgTile = null;
      var fetchTileCalled = false;
      renderTile._fetch = function() {
        fetchTileCalled = true;
        return new Promise(function(resolve) {
          resolve({ blob: function() { return blobFixture; }});
        });
      }

      return new Promise(function(resolve, reject) {
        renderTile.render().then(function() {
          fetchTileCalled ? resolve() : reject();
        });
      });
    }
  });

})();
