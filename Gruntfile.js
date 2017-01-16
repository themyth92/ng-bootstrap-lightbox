'use strict';
module.exports = function ex(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
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
    cssmin: {
      dist: {
        files: {
          'dist/css/lightbox.min.css': ['src/css/lightbox.css']
        }
      }
    },
    ngtemplates: {
      dist: {
        options: {
          htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true },
          module: 'ngBootstrapLightbox'
        },
        src: 'src/partials/**.html',
        dest: 'dist/temp/templates.js'
      }
    },
    concat: {
      options: {
        separator: ';',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        dest: 'dist/temp/lightbox.js',
        src: ['src/js/lightbox.module.js',
          'src/js/lightbox.service.js',
          'src/js/lightbox.directive.js',
          'dist/temp/templates.js']
      }
    },
    clean: {
      temp: ['dist/temp'],
      dist: ['dist/']
    },
    copy: {
      assets: {
        files: [{
          expand: true,
          src: '*',
          dest: 'dist/img/',
          cwd: 'src/img/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          src: 'lightbox.js',
          dest: 'dist/js/',
          cwd: 'dist/temp/'
        }, {
          expand: true,
          src: 'lightbox.css',
          dest: 'dist/css/',
          cwd: 'src/css/'
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
          angular: true
        },

        '-W027': true
      },

      all: ['src/js/*.js']
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('dist', ['clean:dist', 'ngtemplates', 'concat', 'copy:dist', 'uglify',
    'clean:temp', 'copy:assets', 'cssmin']);
};
