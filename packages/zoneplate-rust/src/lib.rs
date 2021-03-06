use std::f64::consts::PI;
use std::mem;
use std::os::raw::c_void;
use wasm_bindgen::prelude::*;
// use wasm_bindgen::Clamped;
// use web_sys::{CanvasRenderingContext2d, ImageData};

#[wasm_bindgen]
pub fn add_rust(x: i32, y: i32) -> i32 {
    x + y
}

#[wasm_bindgen]
pub fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);
    return ptr as *mut c_void;
}

#[wasm_bindgen]
pub fn dealloc(ptr: *mut c_void, cap: usize) {
    unsafe {
        let _buf = Vec::from_raw_parts(ptr, 0, cap);
    }
}

#[wasm_bindgen]
pub fn draw(
    // ctx: &CanvasRenderingContext2d,
    data: &mut [u8],
    width: u32,
    height: u32,
    frames: u32,
    t: f64,
    cx2: f64,
    cy2: f64,
    cxt: f64,
    cyt: f64,
    ct: f64,
) {
    // let size = (width * height * 4) as usize;

    // We tried using a pointer allocated by alloc() above
    // It was deemed an unnecessary optimization
    // - 1 million alloc/dealloc invocations takes 60ms
    // this method requires passing the alloc() -> pointer: *mut u8 param
    // let data = unsafe { slice::from_raw_parts_mut(pointer, size) };

    // This allocates a new vec every render, and casts it to $mut [u8]
    // also sets all values to 255
    // let mut v = vec![255_u8; size];
    // let data: &mut [u8] = v.as_mut();

    // The real workhorse of this algorithm, generating pixel data
    fill_zoneplate(data, width, height, frames, t, cx2, cy2, cxt, cyt, ct);

    // let img_data = ImageData::new_with_u8_clamped_array_and_sh(Clamped(data), width, height)?;
    // ctx.put_image_data(&img_data, 0.0, 0.0)
}

fn fill_zoneplate(
    data: &mut [u8],
    width: u32,
    height: u32,
    frames: u32,
    t: f64,
    cx2: f64,
    cy2: f64,
    cxt: f64,
    cyt: f64,
    ct: f64,
) {
    let cx = width as i32 / 2;
    let cy = height as i32 / 2;

    let f = frames as f64;
    let h = height as f64;
    let w = width as f64;

    // originally: x=(i/W), y=(j/H) both in [0,1]
    // phi = cx2 * x^2*W + cy2*y^2*H + cxt*x*t*F*F/2 + cyt*y*t*F*F/2 + ct*t*F

    let mut index = 0;
    let ctt = ct * frames as f64 * t;

    for j in -cy..cy {
        let cy2y2 = cy2 * (j * j) as f64 / h;
        let cytyt = cyt * (j as f64 / h) * (t * f * f / 2.0);
        for i in -cx..cx {
            let mut phi: f64 = cy2y2 + cytyt + ctt;
            if cx2 != 0.0 {
                let cx2x2 = cx2 * (i * i) as f64 / w;
                phi += cx2x2;
            }
            if cxt != 0.0 {
                let cxtxt = cxt * (i as f64 / w) * (t * f * f / 2.0);
                phi += cxtxt;
            }

            phi = phi * PI;

            // inline trig calculation - <f64>.cos()
            // let c = (phi.cos() * 126.0 + 127.0) as u8;

            // Use the COSINE_LOOKUP (Quantized) table
            let abs_phi = if phi < 0.0 { -phi } else { phi };
            let i_phi = ((Q as f64 * abs_phi / (2.0 * PI)).floor()) as usize % Q;
            let c = COSINE_LOOKUP[i_phi];

            //  rust'ish color
            // data[index + 0] = c;
            // data[index + 1] = c / 2;
            // data[index + 2] = 0;
            // data[index + 3] = 255;

            data[index + 0] = c;
            data[index + 1] = c;
            data[index + 2] = c;
            // data[index + 3] = 255; // set in allocation (255_u8)
            index += 4;
        }
    }
}

#[macro_use]
extern crate lazy_static;

// Using lazy_static for lookup: https://stackoverflow.com/questions/59121887/in-rust-can-i-instantiate-my-const-array-without-hard-coding-in-the-values-com
const Q: usize = 1024;
lazy_static! {
    pub static ref COSINE_LOOKUP: [u8; Q] = {
        let mut table = [0_u8; Q];

        for i_phi in 0..Q {
            let phi = (i_phi as f64) * 2.0 * PI / (Q as f64);
            table[i_phi] = (phi.cos() * 126.0 + 127.0) as u8;
        }

        table
    };
}
