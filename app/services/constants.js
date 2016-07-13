angular.module('tru.')
  .constant('electron', require('electron'))
  .constant('path', require('path'))
  .constant('tone', require('Tone'))
  .constant('lodash', window._);