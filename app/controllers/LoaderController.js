angular.module('tru.').controller('LoaderController', ['$timeout', '$location', function ($timeout, $location) {
  console.log('Tru. Loading!');
  $timeout(function(){
    "use strict";
    $location.path('/home');
  },2000);
}]);