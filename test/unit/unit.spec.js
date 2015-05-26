'use strict';

describe('Lightbox directive unit test:', function(){
    var $compile, $rootScope, $scope, element, self;

    beforeEach(angular.mock.module('iSlide'));

    beforeEach(inject(function(_$compile_, _$rootScope_){

        $compile         = _$compile_;
        $rootScope     = _$rootScope_; 
        $scope         = $rootScope.$new();
    }));

    it('should throw error when user does not specify album attr', function(){
        expect(function(){
            element   = $compile("<div lightbox></div>")($scope);
            $scope.$digest();
        }).toThrow(new Error('No album data or album data is not correct in type'));
    })

    it('should throw error when user does not have src in at least one album value', function(){
        var album = [{
          src : '1'
        },{
          src : '2'
        },{}]

        $scope.album = album;

        expect(function(){
            element   = $compile("<div album = 'album' lightbox></div>")($scope);
            $scope.$digest();  
        }).toThrow(new Error('One of the album data does not have source data'));
    })

    it('should throw error when the index is not a number', function(){
        
        var album = [{
          src : '1'
        },{
          src : '2'
        }]

        var index = 'some index';
        
        $scope.album            = album;        
        $scope.currentImageIndex = index;

        expect(function(){
            element   = $compile("<div album = 'album' current-image-index = 'currentImageIndex' lightbox></div>")($scope);
            $scope.$digest();  
        }).toThrow(new Error('Current image index is not a number'));  
    })

    it('should have correct data from attributes and predefined user options', function(){
        
        var album = [{
          src : '1'
        },{
          src : '2'
        }]

        var index = '1';
        
        //no options in the scope        
        $scope.album              = album;        
        $scope.currentImageIndex  = index;
        $scope.options            = {};

        element   = $compile("<div album = 'album' options = 'options' current-image-index = 'currentImageIndex' lightbox></div>")($scope);
        $scope.$digest();

        self                      = $scope;

        var options = {
            fadeDuration                 : 0.7,
            resizeDuration               : 0.5,
            fitImageInViewPort           : false,
            positionFromTop              : 50,
            showImageNumberLabel         : false,
            alwaysShowNavOnTouchDevices  : false,
            wrapAround                   : false
        }

        expect($scope.options).toEqual(options);
        expect(self.album).toEqual(album);
        expect(self.currentImageIndex).toBe(1);
    })

    it('should change options according to user options', function(){

        var album = [{
          src : '1'
        },{
          src : '2'
        }]

        var index = '1';
        
        //no options in the scope        
        $scope.album              = album;        
        $scope.currentImageIndex  = index;
        
        $scope.options            = {
            fadeDuration                 : 1.0,
            resizeDuration               : 0.8,
            fitImageInViewPort           : false,
            positionFromTop              : 100,
            showImageNumberLabel         : false,
            alwaysShowNavOnTouchDevices  : true,
            wrapAround                   : true
        };

        element   = $compile("<div album = 'album' options = 'options' current-image-index = 'currentImageIndex' lightbox></div>")($scope);
        $scope.$digest();

        self                      = $scope;

        var options = {
            fadeDuration                 : 1.0,
            resizeDuration               : 0.8,
            fitImageInViewPort           : false,
            positionFromTop              : 100,
            showImageNumberLabel         : false,
            alwaysShowNavOnTouchDevices  : true,
            wrapAround                   : true
        }

        expect(self.options).toEqual(options);
        expect(self.album).toEqual(album);
        expect(self.currentImageIndex).toBe(1);
    })

    describe('Functionality test:', function(){

        beforeEach(function(){

            var album = [{
              src : '1'
            },{
              src : '2'
            }]

            var index = '1';
            
            //no options in the scope        
            $scope.album              = album;        
            $scope.currentImageIndex  = index;
            
            $scope.options            = {
                fadeDuration                 : 1.0,
                resizeDuration               : 0.8,
                fitImageInViewPort           : false,
                positionFromTop              : 100,
                showImageNumberLabel         : false,
                alwaysShowNavOnTouchDevices  : true,
                wrapAround                   : true
            };

            element   = $compile("<div album = 'album' options = 'options' current-image-index = 'currentImageIndex' lightbox></div>")($scope);
            $scope.$digest();

            self                      = element.isolateScope();
        })

        it('should add animation class to directive before binding load event', function(){
            
            expect(self.element.$outerContainer.css('-webkit-transition-duration')).toBe('0.8s');
            expect(self.element.$outerContainer.css('transition-duration')).toBe('0.8s');
            expect(self.element.$dataContainer.css('-webkit-animation-duration')).toBe('1s');
            expect(self.element.$dataContainer.css('animation-duration')).toBe('1s');
            expect(self.element.$image.css('-webkit-animation-duration')).toBe('1s');
            expect(self.element.$image.css('animation-duration')).toBe('1s');
        })

        it('should hide the image, arrow and only display the preloader before binding load event', function(){

            //show reloader and hide the image
            expect(self.ui.showReloader).toBe(true);

            //hide arrow
            expect(self.ui.showLeftArrow).toBe(false);
            expect(self.ui.showRightArrow).toBe(false);
            expect(self.ui.showArrowNav).toBe(false);
        })

        it('should position the lightbox on screen according to user option before binding the load event', function(){

            expect(self.element.$lightbox.css('top')).toBe('100px');
            expect(self.element.$lightbox.css('left')).toBe('0px');
        })
    })
}) 