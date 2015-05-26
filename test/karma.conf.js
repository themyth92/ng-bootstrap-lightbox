module.exports = function(config){
	config.set({
		basePath 	: '../',

		files 		: [
			{pattern : 'bower_components/angular/angular.js', watched : false, included : true},
			{pattern : 'bower_components/angular-mocks/angular-mocks.js', watched : false, included : true},
			{pattern : 'src/js/imageSlider.js', watched : false, included : true},
			{pattern : 'test/unit/*.spec.js', watched : true, included : true}
		],

		frameworks 	: ['jasmine'],
		browsers    : ['PhantomJS'],
		logLevel  	: config.LOG_INFO,
		singleRun   : true,
		autoWatch   : true
	})
} 
