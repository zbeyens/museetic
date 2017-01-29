module.exports = BufferWriter;

/**
 * Used for big packets
 */
function BufferWriter() {
    this.bytes = [];
    this.miniBuf = new ArrayBuffer(4);
    this.miniView = new DataView(this.miniBuf);
}

/**
 * true: little endian
 * add each data in this.miniBuf
 * add each byte to this.bytes
 * @type {Object}
 */
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

    /**
     * if username not empty:
     * Javascript String are stored in UTF-16
     * encodeURIComponent to get UTF-8 bytes URL-encoded
     * unescape to decode
     * send all the charCode bytes
     * @param {String} data
     */
    setStringUTF8: function(data) {
        if (data && data.length) {

            var utf8 = unescape(encodeURIComponent(data));
            // REVIEW: max 255 bytes
            this.setUint8(utf8.length);
            for (var i = 0; i < utf8.length; i++) {
                this.setUint8(utf8.charCodeAt(i));
            }
        } else {
            this.setUint8(0);
        }
    },

    /**
     * set 8 flags in one byte
     * @param {list} flags 0-1
     */
    setFlags: function(flags) {
        var data = this.toByte(flags);
        this.setUint8(data);
    },

    /**
     * convert 8 binary to 1 byte
     * @param  {list} arr of binary
     * @return {int}     byte
     */
    toByte: function(arr) {
        var byte = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                byte |= 1 << i;
            }
        }
        return byte;
    },

    /**
     * push all the bytes of this.miniBuf in this.bytes
     * then clear this.miniBuf
     * @param {int} lenBytes
     */
    addToBytes: function(lenBytes) {
        for (var i = 0; i < lenBytes; i++) {
            this.bytes.push(this.miniView.getUint8(i));
        }
        this.clearMiniBuf();
    },

    /**
     * clear this.miniBuf after addToBytes
     * @return {void}
     */
    clearMiniBuf: function() {
        this.miniBuf = new ArrayBuffer(4);
        this.miniView = new DataView(this.miniBuf);
    },

    /**
     * form the final Buffer from this.bytes
     * @return {Buffer}
     */
    form: function() {
        var buf = new ArrayBuffer(this.bytes.length);
        var view = new DataView(buf);
        for (var i = 0; i < this.bytes.length; i++) {
            view.setUint8(i, this.bytes[i]);
        }
        return buf;
    },
};
