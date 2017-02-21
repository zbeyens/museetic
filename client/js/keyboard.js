/** ?
 * The MIT License (MIT)
Copyright (c) 2013 Jerome Etienne

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

exports = module.exports = Keyboard;

function Keyboard() {
    // to store the current states: {keyCodes: boolean}
    this.keyCodes = {};

    //used to oblige to keyUp after keyDown
    this.keyUp = {
        left: true,
        up: true,
        right: true,
        down: true,
        space: true,
    };

    this.alias = {
        /*'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,*/
        'leftEU': 65,
        'leftUS': 81,
        'up': 90,
        'right': 68,
        'down': 83,
        'space': 32,
        'pageup': 33,
        'pagedown': 34,
        'tab': 9
    };

    // create callback to bind/unbind keyboard events
    this.onKeyDown = function(e) {
        this.onKeyChange(e, true);
    }.bind(this);
    this.onKeyUp = function(e) {
        this.onKeyChange(e, false);
    }.bind(this);

    // bind keyEvents
    document.addEventListener("keydown", this.onKeyDown, false);
    document.addEventListener("keyup", this.onKeyUp, false);
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
}

Keyboard.prototype = {
    /**
     * To stop listening of the keyboard events
     */
    destroy: function() {
        document.removeEventListener("keydown", this.onKeyDown, false);
        document.removeEventListener("keyup", this.onKeyUp, false);
    },

    /**
     * store in this.keyCodes, the keyboard dom event
     * @param  {Event} e   : keyCode
     * @param  {Boolean} pressed
     * @return {void}
     */
    onKeyChange: function(e, pressed) {
        // update this.keyCodes
        var keyCode = e.keyCode;
        this.keyCodes[keyCode] = pressed;
    },

    /**
     * query keyboard state to know if a key is pressed of not
     * then reset it
     *
     * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
     * @return {Boolean} true if the key is pressed, false otherwise
     */
    pressed: function(keyDesc) {
        var keys = keyDesc.split("+");
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var pressed, keyCode;
            if (Object.keys(this.alias).indexOf(key) != -1) {
                keyCode = this.alias[key];
            } else {
                // if not in alias
                keyCode = key.toUpperCase().charCodeAt(0);
            }
            pressed = this.keyCodes[keyCode];
            if (!pressed) {
                return false;
            }
        }
        return true;
    },

};
