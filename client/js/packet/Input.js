module.exports = Input;


function Input(input) {
    this.input = input;
}

Input.prototype.form = function() {
    var buf = new ArrayBuffer(1);
    var view = new DataView(buf);

    view.setUint8(0, this.input);

    return buf;
};
