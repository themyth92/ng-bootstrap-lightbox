(function(angular){


  //TODO : 1. Add ngTouch
  //       2. Add more options : removeNavOnTouchDevice
  //                           : disableAnimation
  //                           : lightboxTemplate
  //       3. Fix some options does not work
	'use strict';

	angular
	.module('ngBoostrapLightbox')
	.provider('lightbox', function LightboxProvider(){

		var _this 				      = this;
		_this._lightbox        	= {
		  
      options : {

				fadeDuration 					      : 0.7,
				resizeDuration 					    : 0.5,
				fitImageInViewPort				  : false,
				positionFromTop     			  : 50,
				showImageNumberLabel 			  : false,
				alwaysShowNavOnTouchDevices : false,
				wrapAround 						      : false,
				templateUrl                	: 'src/partials/modal.tpl.html',
				windowTemplateUrl           : 'src/partials/window.tpl.html'
		  },

			modalController : function($scope, $modalInstance, album, currentImageIndex, options){

				$scope.album 				     = album;
				$scope.currentImageIndex = currentImageIndex;
				$scope.options  			   = options;

        //store the modal instance so later we can remove the modal
        //from bootstrap directive
				$scope.modalInstance   	 = $modalInstance;
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

						templateUrl 		    : _this._lightbox.options.templateUrl,
						windowTemplateUrl 	: _this._lightbox.options.windowTemplateUrl,
						controller          : ['$scope', '$modalInstance', 'album', 'currentImageIndex', 'options',
											             _this._lightbox.modalController],
						resolve             : {
							album 			      : function(){
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
				},
			};
		}];
	});
})(angular);