angular.module('tru.').controller('VideoPlayerController', [
  '$rootScope',
  '$scope',
  '$location',
  'speakService',
  function ($rootScope, $scope, $location, speakService) {
    var $ctrl = this;

    $ctrl.filesView = function () {
      $location.path($rootScope.backPath);
    };

    $ctrl.config = {
      sources: [
        {src: $rootScope.currentMedia.path, type: "video/mp4"}
      ],
      theme: "bower_components/videogular-themes-default/videogular.css"
    };

    speakService.speak('Now playing ' + $rootScope.currentMedia.label + '!', function () {
      "use strict";
      $rootScope.$apply(function () {
        $ctrl.autoplay = true;
      });
    });

    $scope.$on('$destroy', function () {
      speakService.stop();
    });
  }]);