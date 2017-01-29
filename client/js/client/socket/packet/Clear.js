module.exports = Clear;


function Clear() {}

/**
 * #2 tell the server to stop send updates 
 * @return {Buffer}
 */
Clear.prototype.form = function() {
    var buf = new ArrayBuffer(1);
    var view = new DataView(buf);

    view.setUint8(0, 2);

    return buf;
};
