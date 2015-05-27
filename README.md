# ng-bootstrap-lightbox
### Introduction
This angular module follows [Lightbox2](http://lokeshdhakar.com/projects/lightbox2/) implementation but make use of [AngularUI Bootstrap Modal](http://angular-ui.github.io/bootstrap/#/modal) and CSS3 animation to  run inside Angular App without the need of jQuery.
### Demo
[Demo](http://themyth92.com/project/ng-bootstrap-lightbox/index.html)
### Setup
0. Dependancy :
 - [AngularJS](https://angularjs.org/)
 - [AngularUI Bootstrap Model](http://angular-ui.github.io/bootstrap/#/modal)
1. Installation :
 - [Download and extract](https://github.com/themyth92/ng-bootstrap-lightbox/archive/master.zip)  
2. Include stylesheet in your app
```html   
<link rel="stylesheet" href="dist/css/lightbox.min.css">
```
3. Include scripts in your app : 
```html
<script src = 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js'></script>
<script src = 'dist/js/bootstrap-modal.min.js'></script>
<script src = 'dist/js/lightbox.min.js'></script>
```
4. Inject `ngBoostrapLightbox` as module dependancy to your current `App`
```javascript
angular.module('myApp', ['ngBoostrapLightbox']);
```

### Basic example : 