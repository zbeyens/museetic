exports = module.exports = MouseState;

function MouseState(canvas) {
    this.canvas = canvas;
    this.running = false;
    this.click = false;
    this.angle = 0;

    this.wheel = 0;

    this.canvas.addEventListener('click', function(e) {
        this.onClick(e);
    }.bind(this));

    this.canvas.addEventListener('mousewheel', function(e) {
        this.onMouseWheel(e);
    }.bind(this));
}

MouseState.prototype = {
    onClick: function(e) {
        if (!this.running) return;

        e = e || window.event;
        this.click = (e.type == 'click');
        var mouseX = e.pageX - this.canvas.offsetLeft;
        var mouseY = e.pageY - this.canvas.offsetTop;

        var x = -this.canvas.clientWidth / 2 + mouseX;
        var y = -this.canvas.clientHeight / 2 + mouseY;
        this.angle = Math.atan2(y, x);
    },

    onMouseWheel: function(e, delta) {
        if (!this.running) return;

        if (e.deltaY > 0) {
            this.wheel--;
        } else if (e.deltaY < 0) {
            this.wheel++;
        }

        e.preventDefault();
        //this disable 'scroll' event for the 'mousewheel' event
        // return false;
    },

    /**
     * return number of wheeled event and reset it
     * @return {Boolean} this.wheel
     */
    wheeled: function() {
        var wheeled = this.wheel;
        this.wheel = 0;
        return wheeled;
    }
};
