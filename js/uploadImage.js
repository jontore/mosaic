(function() {
  'use strict';
  var canvasEl = document.createElement('canvas');
  var ImageUpload = function(uploadEl) {
    if (!uploadEl) {
      throw new Error('a drag and drop upload container must be provided');
    }

    this.canvasEl = canvasEl;
    this.uploadEl = uploadEl;

    this.canvasContext = this.canvasEl.getContext("2d");

    this.listners = [];

    this.initEvents();
  };

  function stopEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  ImageUpload.prototype.initEvents = function() {
    this.uploadEl.addEventListener('dragenter', stopEvent, false);
    this.uploadEl.addEventListener('dragover', stopEvent, false);
    this.uploadEl.addEventListener('drop', this.handleImageUpload.bind(this), false);
  };

  ImageUpload.prototype.markAsInProgress = function() {
    this.uploadEl.classList.add('o-upload-box__progress');
  }

  ImageUpload.prototype.hide = function() {
    this.uploadEl.classList.add('o-upload-box__hide');
  }

  ImageUpload.prototype.handleImageUpload = function(e) {
    stopEvent(e);

    this.markAsInProgress();

    var files = e.dataTransfer.files;
    var file = files[0];

    if (!file) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      this.renderImage(event.target.result).then(function() {
          this._notifyListeners(event);
      }.bind(this));

    }.bind(this);
    reader.readAsDataURL(file);
  };

  ImageUpload.prototype._notifyListeners = function(event) {
    this.listners.forEach(function(listener) {
      listener(event);
    });
  };

  ImageUpload.prototype.renderImage = function(data) {
    return new Promise(function(resolve) {
      var img = new Image();
      img.onload = function() {
        this.width = img.naturalWidth;
        this.height = img.naturalHeight;
        canvasEl.width = this.width;
        canvasEl.height = this.height;

        this.canvasContext.drawImage(img, 0, 0);

        resolve(img);
      }.bind(this);
      img.src = data;

    }.bind(this));

  };

  var getMaxChunkSize = function(offset, chunkSize, size) {
    return offset + chunkSize > size ? size - offset : chunkSize;
  }

  ImageUpload.prototype.getData = function(chunkSizeX, chunkSizeY) {
    chunkSizeY = chunkSizeY || 16;
    chunkSizeX = chunkSizeX || 16;
     var rows = [];
     var x, y;
     for(y = 0; y < this.height; y += chunkSizeY) {
       var row = [];
       for(x = 0; x < this.width; x += chunkSizeX) {
         var chunkX = getMaxChunkSize(x, chunkSizeX, this.width);
         var chunkY = getMaxChunkSize(y, chunkSizeY, this.height);
         var datathing = this.canvasContext.getImageData(x, y, chunkX, chunkY);
         row.push(datathing.data);
       }
       rows.push(row);
     }
     return rows;
  }

  ImageUpload.prototype.onUploaded = function(eventListner) {
    this.listners.push(eventListner);
  };

  window.ImageUpload = ImageUpload;
})();
