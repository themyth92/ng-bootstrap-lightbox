(function wrapper(angular) {
  'use strict';
  angular
    .module('ngBootstrapLightbox')
    .provider('lightbox', lightboxProvider);

  function lightboxProvider() {
    var _this = this;

    _this._lightbox = {
      options: {
        fadeDuration: 0.7, // in seconds
        resizeDuration: 0.5, // in seconds
        fitImageInViewPort: true,
        positionFromTop: 20,  // in pixel
        showImageNumberLabel: false,
        alwaysShowNavOnTouchDevices: false,
        wrapAround: false,
        disableKeyboardNav: false,

        // should not change it for now
        modalTemplateUrl: 'src/partials/modal.tpl.html',
        windowTemplateUrl: 'src/partials/window.tpl.html'
      },

      modalController: function ctrl($scope, $modalInstance, album, currentImageIndex, options) {
        $scope.album = album;
        $scope.currentImageIndex = currentImageIndex;
        $scope.options = options;

        // store the modal instance so later we can remove the modal
        // from bootstrap directive
        $scope.modalInstance = $modalInstance;
      }
    };

    /**
     * [setDefaultOptions for setting the defualt options during config phase]
     *
     * @param {Object} options [default options need to override]
     */
    _this.setDefaultOptions = function setDefaultOptions(options) {
      angular.extend(_this._lightbox.options, options);
    };

    _this.$get = ['$uibModal', function get($uibModal) {
      return {
        /**
         * [open open bootstrap modal when use click on thumbnail]
         *
         * @param  {Array} album [Array of image passing to lightbox, contains : [{src, caption, thumb}]]
         * @param  {int} curIndex [current index of image inside array album that user click on]
         * @param  {Object} options [Override options object]
         */
        open: function open(album, curIndex, options) {
          var newOptions = {};
          angular.extend(newOptions, _this._lightbox.options, options);

          // open bootstrap model
          _this._lightbox.modalInstance = $uibModal.open({
            templateUrl: _this._lightbox.options.modalTemplateUrl,

            // need to fix bootstrap windowTemplateUrl to make lightbox
            // modal at the center of the page
            windowTemplateUrl: _this._lightbox.options.windowTemplateUrl,
            controller: ['$scope', '$uibModalInstance', 'album', 'currentImageIndex', 'options',
              _this._lightbox.modalController],
            resolve: {
              album: function al() {
                return album;
              },
              currentImageIndex: function currentImageIndex() {
                return curIndex;
              },
              options: function opts() {
                return newOptions;
              }
            }
          });

          return _this._lightbox.modalInstance;
        }
      };
    }];
  }
})(angular);
