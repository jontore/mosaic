(function() {
  'use strict';
  const TILE_PATH = '/color/';

  var Tile = function(obj) {
    this.data = obj.data;
    this.svgTile = '';
    this.el = document.createElement('td');
  };

  Tile.prototype.calculateAverageColor = function(type) {
    var rgb = [0, 0, 0];

    //Using a negative while loop for performance
    //Only visiting only rgb skipping a value
    var i = this.data.length - 1;
    while( i > 0 ) {
      rgb[0] += this.data[i-3];
      rgb[1] += this.data[i-2];
      rgb[2] += this.data[i-1];
      i -= 4;
    }

    var total = this.data.length / 4;

    var averageRgb = rgb.map(function(v) {
      return Math.ceil(v / total);
    });

    if (type === 'hex') {
      return averageRgb.reduce(function(str, value) {
        var s = value.toString(16);
        return str += s.length === 1 ? '0' + s : s;
      }, '');
    } else {
      return averageRgb;
    }
  }

  Tile.prototype._fetch = function(url) {
    return window.fetch(url);
  };

  Tile.prototype.get = function() {
    return this._fetch(TILE_PATH + this.calculateAverageColor('hex')).then(function(response) {
      return response.blob();
    }).then(function(response) {
      var img = document.createElement('img');
      var objectURL = URL.createObjectURL(response);
      img.src = objectURL;
      this.svgTile = img;
    }.bind(this));
  };

  Tile.prototype.render = function() {
    if(!this.svgTile) {
      return this.get().then(function() {
        this.el.appendChild(this.svgTile);
      }.bind(this));
    } else {
      return new Promise(function(resolve) {
        this.el.appendChild(this.svgTile);
        resolve(this.el);
      }.bind(this));
    }

  };

  window.Tile = Tile;
})();
