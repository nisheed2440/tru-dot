angular.module('tru.').controller('AudioPlayerController', [
  '$rootScope',
  '$location',
  function ($rootScope, $location) {
    this.config = {
      sources: [
        {src: $rootScope.currentMedia.path, type: "audio/mpeg"}
      ],
      theme: "bower_components/videogular-themes-default/videogular.css"
    };
    this.autoplay = true;
    this.filesView = function () {
      "use strict";
      $location.path($rootScope.backPath);
    }
  }]);