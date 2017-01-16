(function wrapper() {
  'use strict';
  angular
    .module('app', ['ngBootstrapLightbox', 'ngTouch'])
    .controller('Demo1', ['$log', 'lightbox', function ctrl($log, lightbox) {
      var _this = this;

      _this.album = [];
      _this.options = {
        fadeDuration: 0.7,
        resizeDuration: 0.5,
        fitImageInViewPort: true,
        positionFromTop: 20,
        showImageNumberLabel: false,
        alwaysShowNavOnTouchDevices: false,
        wrapAround: false,
        disableKeyboardNav: false
      };

      for (var i = 1; i <= 4; i++) {
          // src attr is a MUST, caption and thumb is optional
        var img = {
          src: 'www/img/image' + i + '.jpg',
          caption: 'Image ' + i + ' caption here',
          thumb: 'www/img/image' + i + '-thumb.jpg'
        };

        _this.album.push(img);
      }

      _this.open = function($index) {
        return lightbox.open(_this.album, $index, _this.options).result.then(function success() {
          $log.info('Close');
        }, function dismiss() {
          $log.info('Dismiss');
        });
      };
    }]);
})();
