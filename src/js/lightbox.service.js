(function(angular){

  //TODO : Add ngTouch - done
  //     : Lightbox content can be changed
  //     : Set text default for image label
  //     : Dynamic update src/details, add new src/details
  //     : Promise when close lightbox - done
  //     : Disable keyboard nav - done 
  //     : Disable ngTouch on specific cases
  //     : Close lightbox dynamically
  //     : Change modal controller
  //     : Change modal template url
  //     : Add service methods : getCurrentImage user navigate to
  //     :                     : programatically navigate to some other images
  //     :                     : Add event if user navigate to other images
  'use strict';

  angular
  .module('ngBoostrapLightbox')
  .provider('lightbox', function LightboxProvider(){

    var _this               = this;
    _this._lightbox         = {
      
      options : {

        fadeDuration                : 0.7, // in seconds
        resizeDuration              : 0.5, // in seconds
        fitImageInViewPort          : false,
        positionFromTop             : 50,  // in pixel
        showImageNumberLabel        : false,
        alwaysShowNavOnTouchDevices : false,
        wrapAround                  : false,
        disableKeyboardNav          : false,

        //should not change it for now
        modalTemplateUrl            : 'src/partials/modal.tpl.html',
        windowTemplateUrl           : 'src/partials/window.tpl.html'
      },

      modalController : function($scope, $modalInstance, album, currentImageIndex, options){

        $scope.album             = album;
        $scope.currentImageIndex = currentImageIndex;
        $scope.options           = options;

        //store the modal instance so later we can remove the modal
        //from bootstrap directive
        $scope.modalInstance     = $modalInstance;
        $scope.$watch(function(){
          return $scope.album;
        }, function(){
          console.log($scope.album);
        })
      }
    };

    /**
     * [setDefaultOptions for setting the defualt options during config phase]
     * 
     * @param {Object} options [default options need to override]
     */
    _this.setDefaultOptions = function(options){

      angular.extend(_this._lightbox.options, options); 
    };

    _this.$get = ['$modal', function($modal){

      return {

        /**
         * [open open bootstrap modal when use click on thumbnail]
         * 
         * @param  {Array} album    [Array of image passing to lightbox, contains : [{src, caption, thumb}]]
         * @param  {int} curIndex [current index of image inside array album that user click on]
         * @param  {Object} options  [Override options object]
         */
        open : function(album, curIndex, options){

          var newOptions = {};
          angular.extend(newOptions, _this._lightbox.options, options);
          
          //open bootstrap model
          _this._lightbox.modalInstance = $modal.open({

            templateUrl             : _this._lightbox.options.modalTemplateUrl,
            
            //need to fix bootstrap windowTemplateUrl to make lightbox
            //modal at the center of the page
            windowTemplateUrl       : _this._lightbox.options.windowTemplateUrl,
            controller              : ['$scope', '$modalInstance', 'album', 'currentImageIndex', 'options',
                                      _this._lightbox.modalController],
            resolve                 : {
              album             : function(){
                return album;
              },
              currentImageIndex : function(){
                return curIndex;
              },       
              options           : function(){
                return newOptions;
              }
            }
          });

          return _this._lightbox.modalInstance;
        },
      };
    }];
  });
})(angular);