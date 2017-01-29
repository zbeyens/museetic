module.exports = Clear;


function Clear() {}

/**
 * #2 the client can clear
 * @return {Buffer}
 */
Clear.prototype.form = function() {
    var buf = new ArrayBuffer(1);
    var view = new DataView(buf);

    view.setUint8(0, 2);

    return buf;
};
