angular.module('tru.').directive('animateIn', ['$timeout', function ($timeout) {
  "use strict";
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.addClass(attrs.animateIn);
      element.addClass('animated');
      $timeout(function () {
        element.addClass('in');
      });
    }
  };
}]);