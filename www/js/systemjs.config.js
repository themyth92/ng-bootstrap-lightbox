(function wrapper() {
  'use strict';
  SystemJS.config({
    transpiler: 'typescript',
    typescriptOptions: {
      emitDecoratorMetadata: true,
      target: 'ES5',
      module: 'commonjs',
      experimentalDecorators: true
    },
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },

    // map tells the System loader where to look for things
    map: {
      main: 'www/js/',
      lightbox: 'src/',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      rxjs: 'npm:rxjs'
    },

    packages: {
      main: {
        main: './main.ts',
        defaultExtension: 'ts'
      },
      lightbox: {
        main: './index.ts',
        defaultExtension: 'ts'
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})();
