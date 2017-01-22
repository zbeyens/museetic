module.exports = BufferReader;

//little endian
function BufferReader(buf) {
    this.buf = buf;
    this.view = new DataView(this.buf);
    this.offset = 0;
}

BufferReader.prototype = {
    getUint8: function() {
        var data = this.view.getUint8(this.offset);
        this.offset += 1;
        return data;
    },

    getInt8: function() {
        var data = this.view.getInt8(this.offset);
        this.offset += 1;
        return data;
    },

    getUint16: function() {
        var data = this.view.getUint16(this.offset, true);
        this.offset += 2;
        return data;
    },

    getInt16: function() {
        var data = this.view.getInt16(this.offset, true);
        this.offset += 2;
        return data;
    },

    getUint32: function() {
        var data = this.view.getUint32(this.offset, true);
        this.offset += 4;
        return data;
    },

    getInt32: function() {
        var data = this.view.getInt32(this.offset, true);
        this.offset += 4;
        return data;
    },

    getFloat32: function() {
        var data = this.view.getFloat32(this.offset, true);
        this.offset += 4;
        return data;
    },

    getStringUTF8: function() {
        var name = "";
        var charCodes = [];
        var length = this.getUint8();
        for (var i = 0; i < length; i++) {
            var charCode = this.getUint8();
            charCodes.push(charCode);
        }

        if (length) {
            try {
                name = decodeURIComponent(escape(String.fromCharCode.apply(null, charCodes)));
            } catch (e) {}
        }
        // console.log(name);

        return name;
    },

    getFlags: function(length) {
        var data = this.getUint8();
        var flags = this.fromByte(data, length);
        return flags;
    },


    fromByte: function(byte, length) {
        var arr = new Array(length);
        for (var i = 0; i < length; i++) {
            arr[i] = (byte & (1 << i)) !== 0;
        }
        return arr;
    },

    addOffset: function(length) {
        this.offset += length;
    },
};
