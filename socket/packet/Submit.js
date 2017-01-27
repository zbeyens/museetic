module.exports = Submit;


function Submit(id) {
    this.id = id;
}

/**
 * #1, id
 * @return {Buffer}
 */
Submit.prototype.form = function() {
    var buf = new ArrayBuffer(3);
    var view = new DataView(buf);
    view.setUint8(0, 1);
    view.setUint16(1, this.id, true);

    return buf;
};
