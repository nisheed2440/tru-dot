angular.module('tru.').controller('HomeController', [
  '$rootScope',
  '$scope',
  '$location',
  'tone',
  'oscillatorService',
  'speakService',
  '$mdToast',
  'electron',
  '$timeout',
  'lodash',
  function ($rootScope, $scope, $location, Tone, oscillatorService, speakService, $mdToast, electron, $timeout, _) {
    console.log('Tru. Home!');

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
      }
    };

    $scope.options = [
      {
        icon: 'assets/ic_library_music_24px.svg',
        label: 'Music',
        excerpt: 'Listen to music on the go',
        enabled: true
      },
      {
        icon: 'assets/ic_library_books_24px.svg',
        label: 'Audiobooks',
        excerpt: 'Listen to books on the go',
        enabled: true
      },
      {
        icon: 'assets/ic_movie_24px.svg',
        label: 'Movies',
        excerpt: 'Watch movies on the go',
        enabled: true
      }
    ];

    $scope.folderView = function (type) {
      $location.path('/home/' + type.toLowerCase());
    };

    $ctrl.currentIndex = -1;

    $ctrl.truDotModeWatcher = $scope.$watch('truDotMode', function (newValue) {
      if (newValue) {
        //Tell the main process home page is loaded
        $ctrl.ipcRenderer.sendSync('home-keys', true);
        //What page it is
        speakService.stop();
        speakService.speak('Home Page!');
        // Add channel listener
        $ctrl.ipcRenderer.on('keypress', $ctrl.keypressHandler);
        //disable movies
        $scope.options[2].enabled = false;
      } else {
        //Release keys
        $ctrl.ipcRenderer.sendSync('release-keys', true);
        //stop and speech going on`
        speakService.stop();
        //Remove event listeners
        $ctrl.ipcRenderer.removeAllListeners('home-keys');
        //enable movies
        $scope.options[2].enabled = true;
      }

      $timeout(function () {
        $ctrl.listItems = document.querySelectorAll('.td-list-item');
      });
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
        speakService.speak($scope.options[$ctrl.currentIndex].label);
        $mdToast.show($mdToast.simple().textContent($scope.options[$ctrl.currentIndex].label + ' sent to braille controller!'));
      }
    };

    $ctrl.selectHandler = function () {
      if ($ctrl.currentIndex !== -1) {
        console.log($ctrl.listItems[$ctrl.currentIndex]);
        angular.element($ctrl.listItems[$ctrl.currentIndex]).find('button').triggerHandler('click');
      }
    };

    /*Oscilloscope*/
    $ctrl.freqIntervals = oscillatorService.getIntervals($scope.options.length);
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
      $ctrl.ipcRenderer.removeAllListeners('home-keys');
    });
  }]);