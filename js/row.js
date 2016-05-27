(function() {
  'use strict';
  var Row = function(opts) {
    if (!opts || !opts.data ) {
      throw new Error('A rgb array for the row must be provided');
    }

    this.el = document.createElement('tr')

    this.tiles = opts.data.map(function(dataTile) {
      if (!dataTile) {
        return;
      }
      return new Tile({
        data: dataTile
      })
    });
  };

  Row.prototype.render = function() {
    var renderPromises = this.tiles.map(function(tile) {
      return tile.render();
    });

    return Promise.all(renderPromises).then(function() {
      this.tiles.forEach(function(tile) {
        this.el.appendChild(tile.el);
      }.bind(this));

      this.el.classList.add('o-tile-container-row');
    }.bind(this))
  };

  window.Row = Row;
})();
