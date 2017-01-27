var BufferWriter = require('../../../../../shared/BufferWriter');

module.exports = Submit;

function Submit(name) {
    this.name = name;
}

/**
 * #1, username
 * @return {Buffer}
 */
Submit.prototype.form = function() {
    var buf = new BufferWriter();

    buf.setUint8(1);
    buf.setStringUTF8(this.name);

    return buf.form();
};
