var getEndianness = function() {
    var a = new ArrayBuffer(4);
    var b = new Uint8Array(a);
    var c = new Uint32Array(a);
    b[0] = 0xa1;
    b[1] = 0xb2;
    b[2] = 0xc3;
    b[3] = 0xd4;
    if (c[0] === 0xd4c3b2a1) {
        return true; //little endian
    }
    if (c[0] === 0xa1b2c3d4) {
        return false; //big endian
    } else {
        throw new Error('Unrecognized endianness');
    }
};



var end = getEndianness();
var ws = new WebSocket("ws://localhost:4000/");
ws.binaryType = 'arraybuffer';
ws.onopen = function() {
    var buffer = new ArrayBuffer(15);
    var dv = new DataView(buffer);
    dv.setUint8(0, 1000, true);
    // dv.setFloat64(3, 50.4, true);
    ws.send(buffer);

    ws.onmessage = function(e) {
        if (e.data instanceof ArrayBuffer) {
            var buf = e.data;
            var dvv = new DataView(buf);
            // console.log(dvv.getInt16(1, true));
            console.log(buf);
        }
    };
    // ws.onmessage = function(data) {

    //var dv = new DataView(data.data);

    // reads an UInt16 at the beginning
    //var uint16 = dv.getUint16(0);

    // };
};
