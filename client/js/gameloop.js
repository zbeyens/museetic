exports = module.exports = GameLoop;

function GameLoop() {
    //polyfill
    this.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());
    this.now = new Date();
    this.accum = 0.0;
}

GameLoop.prototype.start = function(updateCallback, renderCallback) {
    var self = this;

    function loop() {
        self.requestAnimFrame.call(window, loop);

        var newTime = new Date(),
            frameTime = newTime - self.now;
        if (frameTime > 250) {
            frameTime = 250;
        }
        self.now = newTime;
        self.accum += frameTime;

        while (self.accum >= 15) {
            updateCallback();
            self.accum -= 15;
        }

        renderCallback();
    }
    loop();
};
