(function() {
  'use strict';
  var row;

  TestRunner.describe('row', {
    setup: function() {
      row = new Row({
        data: [[33, 33, 33], [44, 44, 44], [12, 12, 12, 11, 11, 11]]
      });
    },
    'it throws an error if no data is provided': function() {
      var threwError = false;
      try {
        new Row({});
      } catch (e) {
        threwError = true;
      }
      return threwError;
    },
    'create a tile object for each tile data array': function() {
      return row.tiles.length === 3
       && row.tiles[0].data[0] === 33
       && row.tiles[1].data[0] === 44
    },
    'it should have a tr element as el': function() {
      return row.el.outerHTML === '<tr></tr>';
    }
  });

  var tileRenderCount;
  var oldRender;
  TestRunner.describe('row #render', {
    setup: function() {
      row = new Row({
        data: [[33, 33, 33], [44, 44, 44], [12, 12, 12, 11, 11, 11]]
      });

      tileRenderCount = 0;
      oldRender = Tile.prototype.render;

      Tile.prototype.render = function() {
        tileRenderCount++;
        this.el = document.createElement('td');
        return new Promise(function(resolve, reject) {
          resolve();
        });
      };
    },
    after: function() {
      Tile.prototype.render = oldRender;
    },
    'renders each tile': function() {
      row.render();

      return tileRenderCount === 3;
    },
    'it waits for all tiles to be rendered before it renders itself': function() {
      return row.render();
    },
    'it attaches tiles to el': function() {
      return new Promise(function(resolve, reject) {
        row.render().then(function() {
          row.el.innerHTML === '<td></td><td></td><td></td>' ? resolve() : reject();
        })
      });
    }
  });
})();
