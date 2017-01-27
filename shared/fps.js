exports = module.exports = Fps;

function Fps() {
    // The higher this value, the less the fps will reflect temporary variations
    // A value of 1 will only keep the last value
    this.filterStrength = 20;
    this.frameTime = 0;
    this.lastLoop = new Date();
    this.thisLoop = null;
    this.value = 0;
    this.oldValue = 0;
}

Fps.prototype.setFps = function(now) {
    var thisFrameTime = (this.thisLoop = now) - this.lastLoop;
    this.frameTime += (thisFrameTime - this.frameTime) / this.filterStrength;
    this.lastLoop = this.thisLoop;
};

Fps.prototype.getFps = function() {
    return (1000 / this.frameTime).toFixed(1);
};

Fps.prototype.startServer = function() {
    setInterval(function() {
        this.value = Math.ceil(1000 / this.frameTime);
        if (this.value != this.oldValue) {
            console.log(this.value + " FPS");
            this.oldValue = this.value;
        }
    }.bind(this), 1000);
};

/*function Timer() {
    this.elapsed = 0;
    this.last = null;
}

Timer.prototype = {
    tick: function(now) {
        this.elapsed = (now - (this.last || now)) / 1000;
        this.last = now;
    },
    fps: function() {
        return Math.round(1 / this.elapsed);
    }
};*/
