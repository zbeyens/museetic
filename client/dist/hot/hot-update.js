webpackHotUpdate(0,{

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _react = __webpack_require__(78);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(255);

	var _App = __webpack_require__(312);

	var _App2 = _interopRequireDefault(_App);

	var _FacebookButton = __webpack_require__(480);

	var _FacebookButton2 = _interopRequireDefault(_FacebookButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createElement(
	    _reactRouter.Route,
	    null,
	    _react2.default.createElement(
	        _reactRouter.Route,
	        { path: '/', component: _App2.default },
	        _react2.default.createElement(_reactRouter.Route, { path: 'signup', component: _FacebookButton2.default })
	    )
	);

/***/ }

})