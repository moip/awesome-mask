'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputHandler = exports.allowedKeys = undefined;

var _isCharacterKeypress = require('./is-character-keypress');

var _vanillaMasker = require('vanilla-masker');

var _vanillaMasker2 = _interopRequireDefault(_vanillaMasker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allowedKeys = exports.allowedKeys = [9, // 'tab'
37, // 'left'
38, // 'up'
39, // 'right'
40];

var inputHandler = exports.inputHandler = function inputHandler(ev) {
  var mask = ev.target.getAttribute('data-mask');
  if (isAllowedKey(ev.keyCode)) return;
  if ((0, _isCharacterKeypress.isCharacterKeyPress)(ev) && ev.target.value.length >= mask.length) {
    ev.preventDefault();
  }
  setTimeout(function () {
    maskInput(mask, ev.target);
    broadcast(ev);
  }, 0);
};

var isAllowedKey = function isAllowedKey(code) {
  return allowedKeys.some(function (key) {
    return key == code;
  });
};

var maskInput = function maskInput(mask, input) {
  if (mask === 'money') {
    input.value = _vanillaMasker2.default.toMoney(input.value, { showSignal: true });
  } else {
    input.value = mask && mask.length > 0 ? _vanillaMasker2.default.toPattern(input.value, mask) : input.value;
  }
};

var getEventForOldBrowser = function getEventForOldBrowser(eventType) {
  var ev = document.createEvent('Event');
  ev.initEvent(eventType, false, false);
  return ev;
};

var broadcast = function broadcast(ev) {
  var inputEvent = null;
  var changeEvent = null;

  try {
    inputEvent = new Event('input');
    changeEvent = new Event('change');
  } catch (err) {
    inputEvent = getEventForOldBrowser('input');
    changeEvent = getEventForOldBrowser('change');
  }

  ev.target.dispatchEvent(inputEvent);
  ev.target.dispatchEvent(changeEvent);
};