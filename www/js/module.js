angular
  .module('app', ['ngBoostrapLightbox', 'ngTouch'])
  .controller('Demo1', ['lightbox', function(lightbox){

      var _this = this;

      _this.album = [];
      _this.options = {

        //default options
        fadeDuration                 : 0.7,
        resizeDuration               : 0.5,
        fitImageInViewPort           : false,
        positionFromTop              : 50,  
        showImageNumberLabel         : false,
        alwaysShowNavOnTouchDevices  : false,
        wrapAround                   : false,
        disableKeyboardNav           : false
      };

      for(var i = 1 ; i <= 4 ; i++){
          
        //src attr is a MUST, caption and thumb is optional
        var img = {

          src       : 'www/img/image' + i + '.jpg',
          caption   : 'Image ' + i + ' caption here',
          thumb     : 'www/img/image' + i + '-thumb.jpg' 
        };

        _this.album.push(img);  
      }

      _this.open = function($index){

        lightbox.open(_this.album, $index, _this.options);
      }
  }])
  .controller('Demo2', ['$timeout', 'lightbox', function($timeout, lightbox){
   
    //dynamic content
    var _this  = this;
    _this.album = [];

    _this.options = {

      fitImageInViewPort           : true,
      positionFromTop              : 20,  
    };

    var captionList = [
      'Image caption changed. Image content will be changed after 3 seconds ...',
      'Image content changed. New image will be added after 3 seconds ...',
      'Image added. Navigate right or left nav bar to see new image. Another new image will be added after 5 seconds ...',
      'Image added. Finish the dynamic demo'
    ];

    var srcList = [
      'www/img/image1.jpg',
      'www/img/image2.jpg',
      'www/img/image3.jpg',
      'www/img/image4.jpg',
    ];

    var thumbList = [
      'www/img/image1-thumb.jpg',
      'www/img/image2-thumb.jpg',
      'www/img/image3-thumb.jpg',
      'www/img/image4-thumb.jpg',
    ]

    _this.album.push({
      src       : 'www/img/image1.jpg',
      caption   : 'Image caption will be changed after 3 seconds',
      thumb     : 'www/img/image1-thumb.jpg',
    });

    _this.open = function($index){

      lightbox.open(_this.album, $index, _this.options).result.then(function(){
        
        if(promise){

          $timeout.cancel(promise);
        }
      });

      timeoutWrapper(3000);
    }

    //demo using $timeout
    var steps = 0;
    var promise = null;

    function timeoutWrapper(time){

      promise = $timeout(function(){

        if(steps < 2){
          
          _this.album[0].caption = captionList[steps];
          _this.album[0].src     = srcList[steps];
          
          steps ++;

          timeoutWrapper(3000);  
        }
        else
          if(steps < 4){
            
            _this.album.push({
              src     : srcList[steps],
              caption : captionList[steps],
              thumb   : thumbList[steps]
            });

            steps ++;
            timeoutWrapper(5000);  
          }
      }, time);
    }

  }]);