angular.module('tru.').factory('speakService', ['$timeout', function ($timeout) {
  "use strict";
  var synth = window.speechSynthesis;
  var speakTimeout = null;
  var _speak = function (text, callback, opts) {
    if ('speechSynthesis' in window) {
      // Synthesis support. Make your web apps talk!
      var utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      utterance.onend = function () {
        if (callback) {
          callback();
        }
      };
      utterance.onerror = function (e) {
        if (callback) {
          callback(e);
        }
      };
      synth.speak(utterance);
    }
  };
  var _speakWords = function (text, callback, opts) {
    if (speakTimeout) {
      $timeout.cancel(speakTimeout);
    }
    speakTimeout = $timeout(function () {
      _speak(text, callback, opts);
    }, 600);
  };

  var _hushWords = function () {
    synth.cancel();
  };

  return {
    speak: _speakWords,
    stop: _hushWords
  };
}]);