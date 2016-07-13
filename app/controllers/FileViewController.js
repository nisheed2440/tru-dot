angular.module('tru.').controller('FileViewController', [
  '$rootScope',
  '$scope',
  '$location',
  '$routeParams',
  'electron',
  'lodash',
  'tone',
  'oscillatorService',
  'speakService',
  '$mdToast',
  function ($rootScope, $scope, $location, $routeParams, electron, _, Tone, oscillatorService, speakService, $mdToast) {
    console.log('Tru. File View!');

    var ipcRenderer = electron.ipcRenderer;
    $scope.folderName = $routeParams.type;
    $scope.fileExtensions = [];
    $scope.files = [];

    speakService.speak($scope.folderName);

    switch ($scope.folderName) {
      case 'music':
      case 'audiobooks':
        $scope.fileExtensions = ['.mp3'];
        $scope.fileIcon = 'assets/ic_library_music_24px.svg';
        break;
      case 'movies':
        $scope.fileExtensions = ['.mp4'];
        $scope.fileIcon = 'assets/ic_movie_24px.svg';
        break;

    }

    $scope.tree = ipcRenderer.sendSync('tru.directory', $scope.folderName, $scope.fileExtensions);

    if ($scope.tree) {
      _.each($scope.tree.children, function (file) {
        "use strict";
        $scope.files.push({
          label: file.name.substr(0, file.name.lastIndexOf('.')) || file.name,
          path: file.path,
          icon: $scope.fileIcon
        });
      });
    }

    $scope.homeView = function () {
      "use strict";
      $rootScope.currentMedia = null;
      $rootScope.currentMediaExt = null;
      $location.path('/home');
    }

    $scope.playMedia = function (file) {
      "use strict";
      $rootScope.backPath = $location.path();
      $rootScope.currentMedia = file;
      $rootScope.currentMediaExt = $scope.fileExtensions;
      var playerType = $scope.folderName === 'music' || $scope.folderName === 'audiobooks' ? 'audio' : 'video';
      $location.path('/home/' + $scope.folderName + '/' + playerType);
    };

    $scope.freqencyIntervals = oscillatorService.getIntervals($scope.files.length);
    oscillatorService.startOsc();

    $scope.toneOn = function (index) {
      "use strict";
      $mdToast.showSimple($scope.files[index].label + ' sent to braille controller!');
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
