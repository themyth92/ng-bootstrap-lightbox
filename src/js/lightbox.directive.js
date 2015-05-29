(function(angular){

  angular
    .module('ngBoostrapLightbox')
    .directive('lightbox',  ['$document', 
                             '$window',
                             '$timeout',
                             '$rootScope', 
            function($document, 
                     $window,
                     $timeout, 
                     $rootScope){
    
    'use strict';

    return {
        restrict    : 'AE',
        replace     : true,
        scope       : false,
        template    : '<div id="lightbox" class="lightbox" ng-click = "close($event)">'+
                        '<div class="lb-outerContainer transition" ng-swipe-left = "prevImage()" ng-swipe-right = "nextImage()">'+
                          '<div class="lb-container" style = "padding:4px">'+
                             '<img ng-src = "{{content.src}}" class="lb-image animation fadeIn" ng-show = "!ui.showReloader">'+
                             '<div class="lb-nav" ng-show = "ui.showArrowNav">'+
                                 '<a class="lb-prev" ng-show = "ui.showLeftArrow" href="" ng-click = "prevImage()"></a>'+
                                 '<a class="lb-next" ng-show = "ui.showRightArrow" href="" ng-click = "nextImage()"></a>'+
                              '</div>'+
                            '<div class="lb-loader" ng-show = "ui.showReloader">'+
                              '<a class="lb-cancel"></a>'+
                            '</div>'+
                         '</div>'+
                        '</div>'+
                        '<div class="lb-dataContainer" ng-show = "!ui.showReloader">'+
                          '<div class="lb-data">'+
                            '<div class="lb-details"><span class="lb-caption" style="display: inline;" ng-bind = "content.caption"></span>'+
                                              '<span class="lb-number" ng-bind = "content.pageNumber"></span>'+
                            '</div>'+
                            '<div class="lb-closeContainer">'+
                              '<a class="lb-close" ng-click="close($event)"></a>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>',

      link : function(scope, elem, attrs){

        /*=========================================================================
        ================================ UTILIY FUNC ==============================
        =========================================================================*/
        
        function findClass(className){
          
          return angular.element(elem[0].querySelector(className));
        }

        /*=========================================================================
        ================================ UTILIY FUNC ==============================
        =========================================================================*/
          
        /**
         * [checkScopeData validate if data use passing from
         * controller is enough to process]
         * 
         * @return {Boolean} [validate if all info is ok]
         */
        function checkScopeData(){
          
          if(_this.album && 
             _this.album instanceof Array &&
             _this.album.length > 0){

            for(var i = 0 ; i < _this.album.length ; i++){
              
              //check whether each element inside
              //album has src data or not
              if(_this.album[i].src){
              
                continue;
              }
              else{
              
                throw('One of the album data does not have source data');
              }
            }
          }
          else{

            throw('No album data or album data is not correct in type');
          }

          //to prevent data understand as string
          //convert it to number 
          if(isNaN(_this.currentImageIndex)){

            throw('Current image index is not a number');
          }
          else{
            
            _this.currentImageIndex = Number(_this.currentImageIndex);
          }

          return true;
        }

        /**
         * [prepareDirective add CSS3 animation class that is necessary
         * to make lightbox animate. Position lightbox to suitable position]
         */
        function prepareDirective(){

          //add css3 animation to the element
          //instead if using jquery animation here
          addCssAnimation();

          //position the postion of the image
          //according to user's option
          positionLightBox();
        }

        /**
         * [registerWatcher list event will be executed when 
         * album src changes]
         */
        function registerWatcher(){
          
          //using anonymous function for watcher
          //instead of using the src variables
          scope.$watch(function(){
            
            return _this.album[_this.currentImageIndex].src;
          }, function(){
            
            changeImageSrc();
            registerImageLoadingEvent();
          });

          //register event to update data caption
          scope.$watch(function(){

            return _this.album[_this.currentImageIndex].caption;
          }, function(){
            
            updateDetails();  
          });
        }

        /*=============================================

          @register the loading event for image
          @whenever the src of image has been changed

        ==============================================*/
        function registerImageLoadingEvent(){

          //show reloader
          hideImage();

          //start to register the event and
          //be ready for callback
          _this.element.$image.bind('load', function(){
            
            $timeout(onLoadSuccess);
          });
        }

        /**
         * [end close modal]
         */
        function end(){
          
          if(!_this.options.disableKeyboardNav){

            //unbind keyboard event
            disableKeyboardNav(); 
          }

          //unbind all the event
          _this.element.$image.unbind('load');
          _this.modalInstance.close();
        }

        function positionLightBox(){
          
          var top   = _this.options.positionFromTop;
          var left  = 0;

          _this.element.$lightbox.css({
            top   : top  + 'px',
            left  : left + 'px' 
          });
        } 

        /**
         * [addCssAnimation add css3 classes for animate lightbox]
         */
        function addCssAnimation(){

          var resizeDuration = _this.options.resizeDuration;
          var fadeDuration   = _this.options.fadeDuration;

          _this.element.$outerContainer.css({'-webkit-transition-duration' : resizeDuration + 's',
                                             '-transition-duration'        : resizeDuration + 's'});
          
          _this.element.$dataContainer.css({'-webkit-animation-duration'   : fadeDuration   + 's',
                                            '-animation-duration'          : fadeDuration   + 's'});

          _this.element.$image.css({'-webkit-animation-duration'            : fadeDuration   + 's',
                                    '-animation-duration'                   : fadeDuration   + 's'});
        }

        /**
         * [changeImage navigate to new imageindex]
         * 
         * @param  {Int} newIndex [new index]
         */
        function changeImage(newIndex){

          //due to the keyboard navigation event is not angular event
          //use apply to digest scope
          $timeout(function(){

            _this.currentImageIndex = newIndex;
          });
        }

        /*======================================
    
          @fire when the image has been loaded

        ======================================*/
        function onLoadSuccess(){

          if(!_this.options.disableKeyboardNav){

            //unbind keyboard event during transition
            disableKeyboardNav();  
          }

          var imageHeight, imageWidth, maxImageHeight, maxImageWidth, windowHeight, windowWidth;
          
          //set default width and height of image to be its natural
          imageWidth  = _this.element.$image.prop('naturalWidth');
          imageHeight = _this.element.$image.prop('naturalHeight');
          
          if(_this.options.fitImageInViewPort){
            
            windowWidth   = $window.innerWidth;
            windowHeight  = $window.innerHeight;
            
            maxImageWidth   = windowWidth   - _this.cssValue.containerLeftPadding   - _this.cssValue.containerRightPadding  - 20;
            maxImageHeight  = windowHeight  - _this.cssValue.containerTopPadding  - _this.cssValue.containerTopPadding    - 120;

            if((_this.element.$image.prop('naturalWidth') > maxImageWidth) || (_this.element.$image.prop('naturalHeight') > maxImageHeight)) {
                    
              if ((_this.element.$image.prop('naturalWidth') / maxImageWidth) > (_this.element.$image.prop('naturalHeight') / maxImageHeight)) {
                
                imageWidth  = maxImageWidth;
                imageHeight = parseInt(_this.element.$image.prop('naturalHeight') / (_this.element.$image.prop('naturalWidth') / imageWidth), 10);
                
                _this.element.$image.css({
                  width : imageWidth + 'px',
                  height: imageHeight + 'px'
                });
              } 
              else {
                
                imageHeight = maxImageHeight;
                imageWidth = parseInt(_this.element.$image.prop('naturalWidth') / (_this.element.$image.prop('naturalHeight') / imageHeight), 10);
                _this.element.$image.css({
                  width : imageWidth + 'px',
                  height: imageHeight + 'px'
                });
              }
            }
            else{
              
              _this.element.$image.css({
                width : imageWidth + 'px',
                height: imageHeight + 'px'
              });
            }
          }

          sizeContainer(imageWidth, imageHeight); 
        }

        /*========================================================

          @implement sizeContainer function
          @inside lightnbox 
          @params imageWidth, @imageHeight
          @change the container of the image into corresponding 
          @width and height
        
        ==========================================================*/
        function sizeContainer(imageWidth, imageHeight){

          var oldWidth  = _this.element.$outerContainer.prop('offsetWidth');
          var oldHeight = _this.element.$outerContainer.prop('offsetHeight');
          var newWidth  = imageWidth  + _this.cssValue.containerRightPadding  + _this.cssValue.containerLeftPadding;
          var newHeight = imageHeight + _this.cssValue.containerTopPadding  + _this.cssValue.containerBottomPadding;

          if (oldWidth !== newWidth || oldHeight !== newHeight) {
            
            _this.element.$outerContainer.css({
              width : newWidth + 'px',
              height: newHeight + 'px'
            });

            //bind resize event to outer container
            _this.element.$outerContainer.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event){
              if(event.target === event.currentTarget){

                postResize(newWidth, newHeight);  
              }
            });
          } 
          else {

            postResize(newWidth, newHeight);
          }
        }

        /*=============================================

          @implement postResize function on lightbox

        =============================================*/
        function postResize(newWidth, newHeight) {
          
          //unbind event
          _this.element.$outerContainer.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");

              _this.element.$dataContainer.css({width : newWidth + 'px'});
              _this.element.$prevLink.css({height : newHeight + 'px'});
              _this.element.$nextLink.css({height : newHeight + 'px'});
              
              $timeout(showImage);  
          }

        /*====================================================

          change the image src when the checking is finished

        =====================================================*/
        function changeImageSrc(){
          
          _this.content.src  = _this.album[_this.currentImageIndex].src;

          //unbind load event if already register
          _this.element.$image.unbind('load');
        }

        /*========================================
          
          @called when image is on phase loading
          @this will hide the image and show the 
          @reloader

        =========================================*/
        function hideImage(){
          
          _this.ui.showReloader   = true;

          _this.ui.showArrowNav   = false;
          _this.ui.showLeftArrow  = false;
          _this.ui.showRightArrow = false;
          //does not disable keyboard nav here 
          //user still want to move right or left
          //if the image is still loading

          //the details and nav has been 
          //binded with showReloader
        }

        function showImage(){

          _this.ui.showReloader = false;

          updateNav();
          updateDetails();

          if(!_this.options.disableKeyboardNav){

            enableKeyboardNav();
          }
        }

        /*============================================
        
          @the implementation is the same as on the
          @update nav function on lightbox

        ============================================*/
        function updateNav(){

          var alwaysShowNav = false;
            
          //check to see the browser support touch event
          try {
              document.createEvent("TouchEvent");
              alwaysShowNav = (_this.options.alwaysShowNavOnTouchDevices)? true: false;
          } 
          catch (e) {}

          //initially show the arrow nav 
          //which is the parent of both left and right nav
          showArrowNav();
            
          if (_this.album.length > 1) {
              
            if (_this.options.wrapAround) {
                
              if (alwaysShowNav) {

                //alternatives this.$lightbox.find('.lb-prev, .lb-next').css('opacity', '1');
                _this.element.$leftArrow.css({'opacity'  :'1'});
                _this.element.$rightArrow.css({'opacity' : '1'});
              }
              
              //alternatives this.$lightbox.find('.lb-prev, .lb-next').show();
              showLeftArrowNav();
              showRightArrowNav();  
            } 
            else{

              if (_this.currentImageIndex > 0) {
                  
                  //alternatives this.$lightbox.find('.lb-prev').show();
                  showLeftArrowNav();

                  if (alwaysShowNav) {

                    //alternatives this.$lightbox.find('.lb-prev').css('opacity', '1');
                    _this.element.$leftArrow.css({'opacity'  :'1'});
                  }
              }

              if (_this.currentImageIndex < _this.album.length - 1) {
                
                //alternatives this.$lightbox.find('.lb-next').show();
                showRightArrowNav();
                
                if (alwaysShowNav) {

                  //alternatives this.$lightbox.find('.lb-next').css('opacity', '1');
                  _this.element.$rightArrow.css({'opacity' : '1'});
                }
              }
            }
          }
        }

        function hideLeftArrowNav(){
          _this.ui.showLeftArrow      = false;
        }

        function showLeftArrowNav(){
          _this.ui.showLeftArrow      = true;
        }

        function hideRightArrowNav(){
          _this.ui.showRightArrow     = false;
        }

        function showRightArrowNav(){
          _this.ui.showRightArrow     = true;
        }

        function showArrowNav(){
          _this.ui.showArrowNav       = true;
        }

        function hideArrowNav(){
          _this.ui.showArrowNav     = false;
        }

        /*=====================================
    
          @based on the updateDetails function 
          @from lightbox 2

        ======================================*/
        function updateDetails(){

          //update the caption
          if(typeof _this.album[_this.currentImageIndex].caption !== 'undefined' &&
             _this.album[_this.currentImageIndex].caption !== ''){

            _this.content.caption = _this.album[_this.currentImageIndex].caption;
          }

          //update the page number if user choose to do so
          //doesn not perform numbering the page if the 
          //array length in album <= 1
          if(_this.album.length > 1 && _this.options.showImageNumberLabel){

            _this.ui.showPageNumber   = true;
            _this.content.pageNumber  = albumLabel(); 
          }
        }

        function albumLabel(){
          
          //due to {_this.currentImageIndex} is set from 0 to {_this.album.length} - 1
          return 'Image ' + Number(_this.currentImageIndex + 1) + " of " + _this.album.length; 
        }

        /*============================================

          @the implementation of enableKeyboardNav function
          @inside lightbox

        =============================================*/
        function enableKeyboardNav(){
            
          _this.element.$body.bind('keyup', function(event){
            keyboardAction(event);
          });
        }

        /*=====================================================

          @the implementation of disableKeyboardNav function
          @inside lightbox

        =====================================================*/
        function disableKeyboardNav(){
          _this.element.$body.unbind('keyup');
        }

        /*=========================================================

          @implement the keyboardAction function inside
          @lightbox.js
          @params: 
          @event: the event object that is passed by the body

        ==========================================================*/
        function keyboardAction($event){
          
          var KEYCODE_LEFTARROW   = 37;
          var KEYCODE_RIGHTARROW  = 39;

          var keycode = $event.keyCode;
          var key     = String.fromCharCode(keycode).toLowerCase();
      
          //no need to check for the esc key because 
          //it is handled by model directive
          if(key === 'p' || keycode === KEYCODE_LEFTARROW) {
              
            if (_this.currentImageIndex !== 0) {
              changeImage(_this.currentImageIndex - 1);
            } 
            else 
              if (_this.options.wrapAround && _this.album.length > 1) {
                  changeImage(_this.album.length - 1);
            }
          } 
          else 
            if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
                
              if (_this.currentImageIndex !== _this.album.length - 1) {
                  changeImage(_this.currentImageIndex + 1);
              } 
              else 
                if (_this.options.wrapAround && _this.album.length > 1) {
                    changeImage(0);
              }
          }
        }

        /*===================================================

          @start the directive whenever it is initialized

        ====================================================*/
        function kickStart(){
          
          //ready to start if there is no error 
          //in album data from user
          if(checkScopeData()){
            prepareDirective();
            registerWatcher();  
          }
        }

        var _this         = scope;
        
        //store the element that needed in the future
        _this.element       = {

          //lightbox is exactly the element itself 
          $lightbox       : elem,
          $overlay        : findClass('.lightboxOverlay'),
          $outerContainer : findClass('.lb-outerContainer'),
          $container      : findClass('.lb-container'),
          $image          : elem.find('img'),
          $body           : $document.find('body'),
          $leftArrow      : findClass('.lb-prev'),
          $rightArrow     : findClass('.lb-next'),
          $navArrow       : findClass('.lb-nav'),
          $dataContainer  : findClass('.lb-dataContainer'),
          $prevLink       : findClass('.lb-prevLink'),
          $nextLink       : findClass('.lb-nextLink')
        };
        
        //control the interactive of the directive
        _this.ui = {

          //control the appear of the reloader
          //@false : image has loaded completely
          //@and ready to be shown
          //true : image is still loading
          showReloader   : false,

          //control the appear of the nav arrow
          //the arrowNav is the parent of both left and right arrow
          //in some cases, the parent shows but the child does not show 
          showLeftArrow    : false,
          showRightArrow   : false,
          showArrowNav     : false,

          //control whether to show the
          //page number or not
          showPageNumber   : false
        };

        //use another variables to store the content of the 
        //directive instead of using the scope album due to 
        //update the details on the fly when needed
        _this.content = {

          src         : '',
          caption     : '',
          pageNumber  : ''
        };

        //set some default padding from lightbox
        //really dont know why have it on lightbox
        //set the default value to 5 instead
        _this.cssValue = {

          containerTopPadding     : parseInt(_this.element.$container.css('padding-top'), 10) || 5,
          containerRightPadding   : parseInt(_this.element.$container.css('padding-right'), 10) || 5,
          containerBottomPadding  : parseInt(_this.element.$container.css('padding-bottom'), 10) || 5,
          containerLeftPadding    : parseInt(_this.element.$container.css('padding-left'), 10) || 5
        };

        //to prevent throw error when user does not specify 
        //the isolate attributes
        _this.options             = _this.options           ||{};
        _this.album               = _this.album             ||[];
        _this.currentImageIndex   = _this.currentImageIndex ||null;

        //boostrap modal instance
        _this.modalInstance       = _this.modalInstance     ||{};

        /*=======================================

          @close the slideshow
          @based on the target that is clicked
          @by user
          @params: $event extract from ng-click
        
        ========================================*/
        _this.close = function($event){
          
          //end the lightbox slideshow if the 
          //target has one these classes
          if(angular.element($event.target).hasClass('lightbox') ||
             angular.element($event.target).hasClass('lb-loader') ||
             angular.element($event.target).hasClass('lb-close')) {
              end();
          } 
        };

        /*==========================================
        
          @fired when the next button is clicked
        
        ============================================*/
        _this.nextImage = function(){
          
          if(_this.currentImageIndex === _this.album.length - 1) {
              
              changeImage(0);
          } 
          else {
              
              changeImage(_this.currentImageIndex + 1);
          }
        };
      
        /*===================================

          @fired when the prev button is clicked

        ===================================*/
        _this.prevImage = function(){

          if (_this.currentImageIndex === 0) {
              changeImage(_this.album.length - 1);
          } 
          else {
              changeImage(_this.currentImageIndex - 1);
          }
        };

        // fired when the directive is called
        kickStart();
      }
    };
  }]); 
})(angular);