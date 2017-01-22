/* jshint shadow:true */
module.exports = BufferWriter;

//little endian
function BufferWriter() {
    this.bytes = [];
    this.miniBuf = new ArrayBuffer(4);
    this.miniView = new DataView(this.miniBuf);
}

BufferWriter.prototype = {
    setUint8: function(data) {
        this.miniView.setUint8(0, data);
        this.addToBytes(1);
    },

    setInt8: function(data) {
        this.miniView.setInt8(0, data);
        this.addToBytes(1);
    },

    setUint16: function(data) {
        this.miniView.setUint16(0, data, true);
        this.addToBytes(2);
    },

    setInt16: function(data) {
        this.miniView.setInt16(0, data, true);
        this.addToBytes(2);
    },

    setUint32: function(data) {
        this.miniView.setUint32(0, data, true);
        this.addToBytes(4);
    },

    setInt32: function(data) {
        this.miniView.setInt32(0, data, true);
        this.addToBytes(4);
    },

    setFloat32: function(data) {
        this.miniView.setFloat32(0, data, true);
        this.addToBytes(4);
    },

    setStringUTF8: function(data) {
        if (data && data.length) {
            var utf8 = unescape(encodeURIComponent(data));
            //max 255 bytes
            this.setUint8(utf8.length);
            for (var i = 0; i < utf8.length; i++) {
                this.setUint8(utf8.charCodeAt(i));
            }
        } else {
            this.setUint8(0);
        }
    },

    setFlags: function(flags) {
        var data = this.toByte(flags);
        this.setUint8(data);
    },

    toByte: function(arr) {
        var byte = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                byte |= 1 << i;
            }
        }
        return byte;
    },

    addToBytes: function(lenBytes) {
        for (var i = 0; i < lenBytes; i++) {
            this.bytes.push(this.miniView.getUint8(i));
        }
        this.clearMiniBuf();
    },

    clearMiniBuf: function() {
        this.miniBuf = new ArrayBuffer(4);
        this.miniView = new DataView(this.miniBuf);
    },

    form: function() {
        var buf = new ArrayBuffer(this.bytes.length);
        var view = new DataView(buf);
        for (var i = 0; i < this.bytes.length; i++) {
            view.setUint8(i, this.bytes[i]);
        }
        return buf;
    },
};
