// THREExKeyboardState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard    = new THREExKeyboardState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//

/** @namespace */
// var THREEx = THREEx || {};

/**
 * - it would be quite easy to push event-driven too
 *   - microevent.js for events handling
 *   - in this._onkeyChange, generate a string from the DOM event
 *   - use this as event name
 */

exports = module.exports = THREExKeyboardState;

function THREExKeyboardState() {
    // to store the current state
    this.keyCodes = {};

    this.keyUp = {
        left: true,
        up: true,
        right: true,
        down: true,
        space: true,
    };

    this.ALIAS = {
        /*'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,*/
        'left': 81,
        'up': 90,
        'right': 68,
        'down': 83,
        'space': 32,
        'pageup': 33,
        'pagedown': 34,
        'tab': 9
    };

    // create callback to bind/unbind keyboard events
    this._onKeyDown = function(event) {
        this._onKeyChange(event, true);
    }.bind(this);
    this._onKeyUp = function(event) {
        this._onKeyChange(event, false);
    }.bind(this);

    // bind keyEvents
    document.addEventListener("keydown", this._onKeyDown, false);
    document.addEventListener("keyup", this._onKeyUp, false);
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
}

/**
 * To stop listening of the keyboard events
 */
THREExKeyboardState.prototype.destroy = function() {
    // unbind keyEvents
    document.removeEventListener("keydown", this._onKeyDown, false);
    document.removeEventListener("keyup", this._onKeyUp, false);
};


/**
 * to process the keyboard dom event
 */
THREExKeyboardState.prototype._onKeyChange = function(event, pressed) {
    // update this.keyCodes
    var keyCode = event.keyCode;
    this.keyCodes[keyCode] = pressed;
};



/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
 */
THREExKeyboardState.prototype.pressed = function(keyDesc) {
    var keys = keyDesc.split("+");
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var pressed;
        if (Object.keys(this.ALIAS).indexOf(key) != -1) {
            pressed = this.keyCodes[this.ALIAS[key]];
        } else {
            pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
        }
        if (!pressed) return false;
    }
    return true;
};
