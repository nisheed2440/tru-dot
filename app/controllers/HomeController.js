angular.module('tru.').controller('HomeController', [
  '$rootScope',
  '$scope',
  '$location',
  'tone',
  'oscillatorService',
  'speakService',
  '$mdToast',
  function ($rootScope, $scope, $location, Tone, oscillatorService, speakService, $mdToast) {
    console.log('Tru. Home!');

    speakService.speak('Home Page!');

    $scope.options = [
      {
        icon: 'assets/ic_library_music_24px.svg',
        label: 'Music',
        excerpt: 'Listen to music on the go'
      },
      {
        icon: 'assets/ic_library_books_24px.svg',
        label: 'Audiobooks',
        excerpt: 'Listen to books on the go'
      },
      {
        icon: 'assets/ic_movie_24px.svg',
        label: 'Movies',
        excerpt: 'Watch movies on the go'
      }
    ];

    $scope.folderView = function (type) {
      "use strict";
      $location.path('/home/' + type.toLowerCase());
    };

    $scope.freqencyIntervals = oscillatorService.getIntervals($scope.options.length);
    oscillatorService.startOsc();

    $scope.toneOn = function (index) {
      "use strict";
      $mdToast.show($mdToast.simple().textContent($scope.options[index].label + ' sent to braille controller!'));
      oscillatorService.updateOsc($scope.freqencyIntervals[index]);
      oscillatorService.unmuteOsc();
    };

    $scope.toneOff = function (index) {
      "use strict";
      oscillatorService.muteOsc();
    };

    $scope.$on('$destroy', function () {
      "use strict";
      speakService.stop();
      oscillatorService.stopOsc();
    });
  }]);