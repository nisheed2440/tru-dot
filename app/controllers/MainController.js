angular.module('tru.').controller('MainController', [
  '$rootScope',
  '$scope',
  'electron',
  '$location',
  function ($rootScope, $scope, electron, $location) {
    var ipcRenderer = electron.ipcRenderer;
    console.log('Tru. initialized!');
    ipcRenderer.on('device-attached', function (e, isAttached) {
      console.log('USB device attached ', isAttached);
      $rootScope.$apply(function () {
        $rootScope.truDotMode = isAttached;
        $location.path('/home');
      });
    });
  }]);