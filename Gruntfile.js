module.exports = function(grunt) {
	
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		karma :{
			unit :{
				configFile: 'test/karma.conf.js'
			}
		},
		uglify :{
			options: {
		      	banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		        		'<%= grunt.template.today("yyyy-mm-dd") %> */'
		    },
			dist: {
		      	files: {
		        	'dist/js/lightbox.min.js': ['dist/temp/lightbox.js']
		      	}
		    }
		},
		cssmin :{
			dist :{
				files: {
			      'dist/css/lightbox.min.css': ['src/css/lightbox.css']
			    }
			}
		},
		ngtemplates: {
		  	dist: {
	      		options:    {
			      	htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true },
			      	module : 'ngBoostrapLightbox'
			    },
			    src:      'src/partials/**.html',
	      		dest:     'dist/temp/templates.js',
		  	}
		},
		concat :{
			options: {
				separator: ';',
		      	banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		        		'<%= grunt.template.today("yyyy-mm-dd") %> */'
		    },
			dist: {		        	
				dest : 'dist/temp/lightbox.js',
				src  : [    'src/js/lightbox.module.js', 
					    'src/js/lightbox.service.js', 
					    'src/js/lightbox.directive.js',
					    'dist/temp/templates.js']
		    }
		},
		clean: {
			temp : ['dist/temp'],
			dist : ['dist/']
		},
		copy: {
			dist :{
				files : [{
					src  : 'src/libs/bootstrap-modal/modal.js',
					dest : 'dist/js/bootstrap-modal.min.js'	
				},{
					expand : true,
					src : '*',
					dest : 'dist/img/',
					cwd : 'src/img/'
				}]
				
			}
		},
		jshint: {
		    options: {
		      	curly: true,
		      	eqeqeq: true,
		      	eqnull: true,
		      	browser: true,
		      	globals: {
		      		angular : true
		      	},
		   
        		'-W027': true,
		    },

		    all :['src/js/*.js'],
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('dist', ['clean:dist', 'ngtemplates', 'concat', 'uglify', 'clean:temp', 'copy', 'cssmin']);
}
