(function() {
  'use strict';
  var uploadBoxEl = document.querySelector('.o-upload-box');
  var tileContainerEl = document.querySelector('.o-tile-container');

  var appendRowAndGetNext = function(index, dataRows) {
    var dataRow = dataRows[index];

    if (!dataRow) {
      appendRowAndGetNext(index + 1, dataRows);
      return;
    }

    var row = new Row({
      data: dataRow
    });

    row.render().then(function() {
      tileContainerEl.appendChild(row.el);
      appendRowAndGetNext(index + 1, dataRows);
    });
  };

  window.mosaic = {
    start: function() {
      var iu = new ImageUpload(uploadBoxEl);
      iu.initEvents();

      iu.onUploaded(function() {
        iu.hide();
        var imageRows = iu.getData(TILE_WIDTH, TILE_HEIGHT);

        //Doing this with recursion can cause callstack overflow.
        //This could be solved using a state machine
        appendRowAndGetNext(0, imageRows);
      });
    }
  }

  mosaic.start();
})();
