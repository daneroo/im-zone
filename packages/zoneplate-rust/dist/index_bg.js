import * as wasm from './index_bg.wasm';

/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
export function add_rust(x, y) {
    var ret = wasm.add_rust(x, y);
    return ret;
}

/**
* @param {number} size
* @returns {number}
*/
export function alloc(size) {
    var ret = wasm.alloc(size);
    return ret;
}

/**
* @param {number} ptr
* @param {number} cap
*/
export function dealloc(ptr, cap) {
    wasm.dealloc(ptr, cap);
}

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} data
* @param {number} width
* @param {number} height
* @param {number} frames
* @param {number} t
* @param {number} cx2
* @param {number} cy2
* @param {number} cxt
* @param {number} cyt
* @param {number} ct
*/
export function draw(data, width, height, frames, t, cx2, cy2, cxt, cyt, ct) {
    try {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.draw(ptr0, len0, width, height, frames, t, cx2, cy2, cxt, cyt, ct);
    } finally {
        data.set(getUint8Memory0().subarray(ptr0 / 1, ptr0 / 1 + len0));
        wasm.__wbindgen_free(ptr0, len0 * 1);
    }
}

