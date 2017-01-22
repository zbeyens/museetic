exports = module.exports = Fps;

function Fps() {
    // The higher this value, the less the fps will reflect temporary variations
    // A value of 1 will only keep the last value
    this.filterStrength = 20;
    this.frameTime = 0;
    this.lastLoop = new Date();
    this.thisLoop = null;
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
        console.log((1000 / this.frameTime).toFixed(1) + " fps");
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
