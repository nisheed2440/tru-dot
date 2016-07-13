angular.module('tru.').controller('AudioPlayerController', [
  '$rootScope',
  '$scope',
  '$location',
  'speakService',
  '$mdToast',
  'electron',
  '$timeout',
  function ($rootScope, $scope, $location, speakService, $mdToast, electron, $timeout) {
    var $ctrl = this;
    //Instance of ipcRender
    $ctrl.ipcRenderer = electron.ipcRenderer;

    //Get the keypress from main process
    $ctrl.keypressHandler = function (e, action) {
      switch (action) {
        case 'volUp':
          //Up handler
          $ctrl.volUpHandler();
          break;
        case 'volDown':
          //Down handler
          $ctrl.volDownHandler();
          break;
        case 'playPause':
          //select handler
          $ctrl.playPauseHandler();
          break;
        case 'back':
          //info handler
          $rootScope.$evalAsync(function () {
            $ctrl.filesView();
          });
          break;
      }
    };

    $ctrl.volUpHandler = function () {
      if ($ctrl.API) {
        if ((Math.round($ctrl.API.volume * 10) / 10) < 1) {
          $ctrl.API.setVolume($ctrl.API.volume + 0.1);
        }
      }
    };
    $ctrl.volDownHandler = function () {
      if ($ctrl.API) {
        if ((Math.round($ctrl.API.volume * 10) / 10) > 0) {
          $ctrl.API.setVolume($ctrl.API.volume - 0.1);
        }
      }
    };
    $ctrl.playPauseHandler = function () {
      if ($ctrl.API) {
        $ctrl.API.playPause();
      }
    };

    $ctrl.truDotModeWatcher = $scope.$watch('truDotMode', function (newValue) {
      if (newValue) {
        //Tell the main process home page is loaded
        $ctrl.ipcRenderer.sendSync('player-keys', true);
        $mdToast.show($mdToast.simple().textContent('Player controls active'));
        //What page it is
        speakService.stop();
        speakService.speak('Now playing ' + $rootScope.currentMedia.label + '!', function () {
          $rootScope.$evalAsync(function () {
            $ctrl.autoplay = true;
          });
        });
        // Add channel listener
        $ctrl.ipcRenderer.on('keypress', $ctrl.keypressHandler);
      } else {
        //Release keys
        $ctrl.ipcRenderer.sendSync('release-keys', true);
        //stop and speech going on`
        speakService.stop();
        //Remove event listeners
        $ctrl.ipcRenderer.removeAllListeners('player-keys');
      }
    });

    $ctrl.config = {
      sources: [
        {src: $rootScope.currentMedia.path, type: "audio/mpeg"}
      ],
      theme: "bower_components/videogular-themes-default/videogular.css"
    };

    $ctrl.filesView = function () {
      $location.path($rootScope.backPath);
    };

    $timeout(function () {
      $ctrl.API = angular.element(document.querySelector('videogular')).isolateScope().API;
      console.log($ctrl.API);
    });

    $scope.$on('$destroy', function () {
      speakService.stop();
      $ctrl.truDotModeWatcher();
    });
  }]);