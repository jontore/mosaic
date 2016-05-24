(function() {
  'use strict';
  var Tile = function(obj) {
    this.data = obj.data;
  };

  Tile.prototype.calculateAverageColor = function() {
    var rgb = [0, 0, 0];

    this.data.forEach(function(value, index) {
      var rgbIndex = index % 3;
      rgb[rgbIndex] += value;
    });

    var total = this.data.length / 3;

    return rgb.map(function(v) {
      return v / total;
    });
  }

  Tile.prototype.get = function() {
    return new Promise(function(reject, resolve) {});
  };


  window.Tile = Tile;
})();
