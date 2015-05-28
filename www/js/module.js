angular
	.module('myApp', ['ngBoostrapLightbox', 'ngTouch'])
	.controller('Ctrl', ['$scope', 'lightbox',
		
		function($scope, lightbox){

			var _this = this;
			var options            = {
        fadeDuration                 : 0.7,
        resizeDuration               : 0.5,
			 	fitImageInViewPort 	 			   : true,
				positionFromTop      			   : 20,  
			  showImageNumberLabel 			   : true,
			  alwaysShowNavOnTouchDevices  : false,
			  wrapAround                   : false
			};

			function init(){

				//init the list of image on the index page
				for(var i = 1 ; i <= 4 ; i++){
					
					//these 3 attributes is a MUST have
					var img = {
						src 		: 'www/img/image' + i + '.jpg',
						caption  	: 'Image ' + i + ' caption here',
						thumb       : 'www/img/image' + i + '-thumb.jpg' 
					};

					_this.album.push(img);	
				}
			}

			_this.album  			= [];
			init();

			_this.kickStart = function($index){

				lightbox.open(_this.album, $index, options);
			}
}]);