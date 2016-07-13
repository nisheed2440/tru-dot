angular.module('tru.').config(['$routeProvider', function ($routeProvider) {
  "use strict";
  $routeProvider
    .when('/', {
      templateUrl: 'app/partials/loader.html',
      controller: 'LoaderController'
    })
    .when('/home', {
      templateUrl: 'app/partials/home.html',
      controller: 'HomeController'
    })
    .when('/home/:type', {
      templateUrl: 'app/partials/file-view.html',
      controller: 'FileViewController'
    })
    .when('/home/:type/video', {
      templateUrl: 'app/partials/video-player.html',
      controller: 'VideoPlayerController',
      controllerAs: 'controller'
    })
    .when('/home/:type/audio', {
      templateUrl: 'app/partials/audio-player.html',
      controller: 'AudioPlayerController',
      controllerAs: 'controller'
    })
    .otherwise('/home');
}])