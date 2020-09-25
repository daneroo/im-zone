/* tslint:disable */
/* eslint-disable */
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
export function add_rust(x: number, y: number): number;
/**
* @param {number} size
* @returns {number}
*/
export function alloc(size: number): number;
/**
* @param {number} ptr
* @param {number} cap
*/
export function dealloc(ptr: number, cap: number): void;
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
export function draw(data: Uint8Array, width: number, height: number, frames: number, t: number, cx2: number, cy2: number, cxt: number, cyt: number, ct: number): void;
