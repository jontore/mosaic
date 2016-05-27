(function() {
  'use strict';

  var iu;
  TestRunner.describe('image upload', {
    setup: function() {
      iu = new ImageUpload(document.createElement('div'));
    },
    'it throws an error if no image uploda element has been provided': function() {
      var threwError = false;
      try {
        new ImageUpload();
      } catch (e) {
        threwError = true;
      }
      return threwError;
    }
  });

  TestRunner.describe('listeners', {
    setup: function() {
      iu = new ImageUpload(document.createElement('div'));
    },
    'it should be called when image has been renderd': function() {
      return new Promise(function(resolve, reject) {
        iu.onUploaded(resolve);

        iu._notifyListeners();
      });
    }
  });

  var getImageDataArgs = [];
  TestRunner.describe('#getData', {
    setup: function() {
      iu = new ImageUpload(document.createElement('div'));
      iu.width = 61;
      iu.height = 61;
      getImageDataArgs = [];
      iu.canvasContext.getImageData = function() {
        getImageDataArgs.push(arguments);
        return {data: [22, 22, 22, 0]}
      };
    },
    'it should get the image data for set chunksize': function() {
      return new Promise(function(resolve, reject) {
        iu.getData(60, 30);
        getImageDataArgs[0][0] == 0;
        getImageDataArgs[0][1] == 0 &&
        getImageDataArgs[0][2] == 60 &&
        getImageDataArgs[0][3] == 30 ? resolve() : reject();
      });
    },
    'it should not render elements outside the width': function() {
      return new Promise(function(resolve, reject) {
        iu.getData(60, 30);
        getImageDataArgs[1][0] == 60;
        getImageDataArgs[1][1] == 0 &&
        getImageDataArgs[1][2] == 1 &&
        getImageDataArgs[1][3] == 30 ? resolve() : reject();
      });
    },
    'it should not render elements outside the height': function() {
      return new Promise(function(resolve, reject) {
        iu.getData(60, 60);
        getImageDataArgs[2][0] == 0;
        getImageDataArgs[2][1] == 60 &&
        getImageDataArgs[2][2] == 60 &&
        getImageDataArgs[2][3] == 1 ? resolve() : reject(getImageDataArgs[2]);
      });
    },
    'it should create all data for each tile in a row': function() {
      var imageData = iu.getData(60, 60);
      return imageData.length === 2
        && imageData[0].length === 2
        && imageData[0][0].length === 4
        && imageData[0][0][0] === 22;
    }
  });
})();
