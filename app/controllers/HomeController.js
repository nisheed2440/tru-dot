angular.module('tru.').controller('HomeController', [
  '$rootScope',
  '$scope',
  '$location',
  function ($rootScope, $scope, $location) {
    console.log('Tru. Home!');

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
  }]);