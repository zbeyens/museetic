exports = module.exports = Debug;

function Debug() {
    debugDiv.style.display = 'inline-block';

    // Simulated lag between client and server.
    this.serverPhysicsInterval = null;
    this.serverStateInterval = null;
    this.lagCompensation = null;
    this.interpolation = null;
    this.interpolationTime = null;

    var player_status = document.getElementById("player_status");
    var _lagCompensation = document.getElementById("lag");
    var _serverPhysicsInterval = document.getElementById("serverPhysicsInterval");
    var _serverStateInterval = document.getElementById("serverStateInterval");
    var _interpolation = document.getElementById("interpolation");
    var _interpolationTime = document.getElementById('interpolationTime');

    _serverPhysicsInterval.value = cfg.serverPhysicsInterval;
    _serverStateInterval.value = cfg.serverStateInterval;
    _lagCompensation.value = cfg.serverLagCompensation;
    _interpolation.checked = cfg.interpolation;
    _interpolationTime.value = cfg.interpolationTime;

    // Update simulation parameters from UI.
    var updateParamFromUI = function() {
        this.lagCompensation = updateNumberFromUI(this.lagCompensation, _lagCompensation);
        this.serverPhysicsInterval = updateNumberFromUI(this.serverPhysicsInterval, _serverPhysicsInterval);
        this.serverStateInterval = updateNumberFromUI(this.serverStateInterval, _serverStateInterval);
        this.interpolation = _interpolation.checked;
        this.interpolationTime = updateNumberFromUI(this.interpolationTime, _interpolationTime);
    }.bind(this);

    var updateNumberFromUI = function(old_value, input) {
        var new_value = parseInt(input.value);
        if (isNaN(new_value)) {
            new_value = old_value;
        }
        input.value = new_value;
        return new_value;
    };

    _lagCompensation.onchange = updateParamFromUI;
    _serverPhysicsInterval.onchange = updateParamFromUI;
    _serverStateInterval.onchange = updateParamFromUI;
    _interpolation.onchange = updateParamFromUI;
    _interpolationTime.onchange = updateParamFromUI;

    // Read initial parameters from the UI.
    updateParamFromUI();
}
