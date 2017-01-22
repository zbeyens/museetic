var cfg = require('../../shared/config');

exports = module.exports = MouseState;

function MouseState(canvas) {
    this.canvas = canvas;
    this.click = false;
    this.angle = 0;

    this.canvas.addEventListener('click', function(e) {
        this.onClick(e);
    }.bind(this));
}

MouseState.prototype.onClick = function(e) {
    e = e || window.event;
    this.click = (e.type == 'click');
    var mouseX = e.pageX - this.canvas.offsetLeft;
    var mouseY = e.pageY - this.canvas.offsetTop;

    var x = -this.canvas.clientWidth / 2 + mouseX;
    var y = -this.canvas.clientHeight / 2 + mouseY;
    this.angle = Math.atan2(y, x);
};
