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
  '$timeout',
  function ($rootScope, $scope, $location, $routeParams, electron, _, Tone, oscillatorService, speakService, $mdToast, $timeout) {
    console.log('Tru. File View!');

    var $ctrl = this;

    $ctrl.toneTimeout = null;

    //Instance of ipcRender
    $ctrl.ipcRenderer = electron.ipcRenderer;

    //Get the keypress from main process
    $ctrl.keypressHandler = function (e, action) {
      switch (action) {
        case 'up':
          //Up handler
          $ctrl.upHandler();
          break;
        case 'down':
          //Down handler
          $ctrl.downHandler();
          break;
        case 'select':
          //select handler
          $ctrl.selectHandler();
          break;
        case 'info':
          //info handler
          $ctrl.infoHandler();
          break;
        case 'back':
          //info handler
          $rootScope.$evalAsync(function () {
            $scope.homeView();
          });
          break;
      }
    };

    $ctrl.folderName = $routeParams.type;
    $ctrl.fileExtensions = [];
    $scope.files = [];

    switch ($ctrl.folderName) {
      case 'music':
      case 'audiobooks':
        $ctrl.fileExtensions = ['.mp3'];
        $scope.fileIcon = 'assets/ic_library_music_24px.svg';
        break;
      case 'movies':
        $ctrl.fileExtensions = ['.mp4'];
        $scope.fileIcon = 'assets/ic_movie_24px.svg';
        break;

    }

    $scope.tree = $ctrl.ipcRenderer.sendSync('tru.directory', $ctrl.folderName, $ctrl.fileExtensions);

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
      $rootScope.currentMediaExt = $ctrl.fileExtensions;
      var playerType = $ctrl.folderName === 'music' || $ctrl.folderName === 'audiobooks' ? 'audio' : 'video';
      $location.path('/home/' + $ctrl.folderName + '/' + playerType);
    };


    $ctrl.currentIndex = -1;

    $timeout(function () {
      $ctrl.listItems = document.querySelectorAll('.td-list-item');
    });


    $ctrl.truDotModeWatcher = $scope.$watch('truDotMode', function (newValue) {
      if (newValue) {
        //Tell the main process home page is loaded
        $ctrl.ipcRenderer.sendSync('files-keys', true);
        //What page it is
        speakService.stop();
        speakService.speak($ctrl.folderName + ' List!');
        // Add channel listener
        $ctrl.ipcRenderer.on('keypress', $ctrl.keypressHandler);
      } else {
        //Release keys
        $ctrl.ipcRenderer.sendSync('release-keys', true);
        //stop and speech going on`
        speakService.stop();
        //Remove event listeners
        $ctrl.ipcRenderer.removeAllListeners('files-keys');
      }
    });

    $ctrl.upHandler = function () {
      var nextIndex = $ctrl.currentIndex - 1;
      if (nextIndex < 0) {
        $ctrl.playTone(60);
      } else {
        $ctrl.currentIndex = nextIndex;
        $ctrl.playTone();
      }
    };

    $ctrl.downHandler = function () {
      var nextIndex = $ctrl.currentIndex + 1;
      if (nextIndex > ($ctrl.listItems.length - 1)) {
        $ctrl.playTone(60);
      } else {
        $ctrl.currentIndex = nextIndex;
        $ctrl.playTone();
      }
    };

    $ctrl.infoHandler = function () {
      if ($ctrl.currentIndex !== -1) {
        speakService.stop();
        speakService.speak($scope.files[$ctrl.currentIndex].label);
        $mdToast.show($mdToast.simple().textContent($scope.files[$ctrl.currentIndex].label + ' sent to braille controller!'));
      }
    };

    $ctrl.selectHandler = function () {
      if ($ctrl.currentIndex !== -1) {
        console.log($ctrl.listItems[$ctrl.currentIndex]);
        angular.element($ctrl.listItems[$ctrl.currentIndex]).find('button').triggerHandler('click');
      }
    };

    /*Oscilloscope*/
    $ctrl.freqIntervals = oscillatorService.getIntervals($scope.files.length);
    oscillatorService.startOsc();

    $ctrl.playTone = function (frequency) {
      if ($ctrl.toneTimeout) {
        $timeout.cancel($ctrl.toneTimeout);
        oscillatorService.muteOsc();
      }
      var newFrequency = frequency || $ctrl.freqIntervals[$ctrl.currentIndex];
      oscillatorService.updateOsc(newFrequency);
      oscillatorService.unmuteOsc();
      $ctrl.toneTimeout = $timeout(function () {
        oscillatorService.muteOsc();
      }, 1000);
    };

    $scope.$on('$destroy', function () {
      speakService.stop();
      $ctrl.truDotModeWatcher();
      //Release keys
      $ctrl.ipcRenderer.sendSync('release-keys', true);
      //Remove event listeners
      $ctrl.ipcRenderer.removeAllListeners('files-keys');
    });

  }]);
