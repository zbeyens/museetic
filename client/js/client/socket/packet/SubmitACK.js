module.exports = SubmitACK;


function SubmitACK() {}

/**
 * #2
 * @return {Buffer}
 */
SubmitACK.prototype.form = function() {
    var buf = new ArrayBuffer(1);
    var view = new DataView(buf);

    view.setUint8(0, 2);

    return buf;
};
