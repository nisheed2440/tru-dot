angular.module('tru.').controller('AudioPlayerController', [
  '$rootScope',
  '$scope',
  '$location',
  'speakService',
  function ($rootScope, $scope, $location, speakService) {
    var $ctrl = this;

    $ctrl.config = {
      sources: [
        {src: $rootScope.currentMedia.path, type: "audio/mpeg"}
      ],
      theme: "bower_components/videogular-themes-default/videogular.css"
    };

    $ctrl.filesView = function () {
      $location.path($rootScope.backPath);
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