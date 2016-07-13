angular.module('tru.').factory('oscillatorService', ['tone', function (Tone) {
  "use strict";
  var _minFrequency = 400;
  var _maxFrequency = 800;
  var _this = this;
  var _getIntervals = function (listLength) {
    var intervals = [];
    if (listLength > 0) {
      var frequencyDiff = _maxFrequency - _minFrequency;
      var currentValue = _minFrequency;
      var incrementValue = frequencyDiff / listLength;

      for (var i = 0; i < listLength; i++) {
        intervals.push(currentValue);
        currentValue += incrementValue;
      }

      return intervals;
    }
    return intervals;
  };

  var _createOscillator = function () {
    _this.oscillator = new Tone.Oscillator(60, "sine").toMaster();
    _this.oscillator.mute = true;
  };

  var _updateOscillatorFreq = function (freq) {
    if (_this.oscillator) {
      _this.oscillator.frequency.value = freq;
    }
  };

  var _stopOscillator = function () {
    if (_this.oscillator) {
      _this.oscillator.mute = true;
      _this.oscillator.stop();
      Tone.Transport.stop();
    }
  };

  var _muteOscillator = function () {
    if (_this.oscillator) {
      _this.oscillator.mute = true;
    }
  };

  var _unmuteOscillator = function () {
    if (_this.oscillator) {
      _this.oscillator.mute = false;
    }
  };

  var _startOscillator = function () {
    if (_this.oscillator) {
      _this.oscillator.start();
      Tone.Transport.start();
    }
  }

  //Create a global instance of oscillator
  _createOscillator();

  return {
    getIntervals: _getIntervals,
    stopOsc: _stopOscillator,
    muteOsc: _muteOscillator,
    unmuteOsc: _unmuteOscillator,
    updateOsc: _updateOscillatorFreq,
    startOsc: _startOscillator
  };
}]);