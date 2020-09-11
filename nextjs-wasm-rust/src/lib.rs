use std::f64::consts::PI;
use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;
use web_sys::{CanvasRenderingContext2d, ImageData};

#[wasm_bindgen]
pub fn add_rust(x: i32, y: i32) -> i32 {
    x + y
}

#[wasm_bindgen]
pub fn draw(
    ctx: &CanvasRenderingContext2d,
    width: u32,
    height: u32,
    frames: u32,
    t: f64,
    cx2: f64,
    cy2: f64,
    cxt: f64,
    cyt: f64,
    ct: f64,
) -> Result<(), JsValue> {
    // The real workhorse of this algorithm, generating pixel data
    let mut data = get_zoneplate(width, height, frames, t, cx2, cy2, cxt, cyt, ct);
    let data = ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut data), width, height)?;
    ctx.put_image_data(&data, 0.0, 0.0)
}

fn get_zoneplate(
    width: u32,
    height: u32,
    frames: u32,
    t: f64,
    cx2: f64,
    cy2: f64,
    cxt: f64,
    cyt: f64,
    ct: f64,
) -> Vec<u8> {
    let mut data: Vec<u8> = vec![127; (width * height * 4) as usize];

    let cx = width as i32 / 2;
    let cy = height as i32 / 2;

    let mut index = 0;
    let ctt = ct * frames as f64 * t;
    for j in -cy..cy {
        // let y2 = (j * j) as f64 / height as f64;
        let cy2y2 = cy2 * (j * j) as f64 / height as f64;
        let cytyt = cyt * (t * frames as f64 * frames as f64 / 2.0) * (j as f64 / height as f64);
        for i in -cx..cx {
            let mut phi: f64 = cy2y2 + cytyt + ctt;
            if cx2 != 0.0 {
                let cx2x2 = cx2 * (i * i) as f64 / width as f64;
                phi += cx2x2;
            }
            if cxt != 0.0 {
                let cxtxt = cxt * (t * (frames * frames / 2) as f64) * (i as f64 / width as f64);
                phi += cxtxt;
            }

            phi = phi * PI;

            // lookup and inline trig calculation - <f64>.cos()
            // let c = phi.cos() * 126.0 + 127.0;

            // Use the COSINE_LOOKUP table
            let abs_phi = if phi < 0.0 { -phi } else { phi };
            let i_phi = ((Q as f64 * abs_phi / (2.0 * PI)).floor()) as usize % Q;
            let c = COSINE_LOOKUP[i_phi];
            // let c = i_phi as u8;

            data[index + 0] = c;
            data[index + 1] = c;
            data[index + 2] = c;
            data[index + 3] = 255;
            index += 4;
        }
    }

    data
}

#[macro_use]
extern crate lazy_static;

// Using lazy_static for lookup: https://stackoverflow.com/questions/59121887/in-rust-can-i-instantiate-my-const-array-without-hard-coding-in-the-values-com
const Q: usize = 1024;
lazy_static! {
    pub static ref COSINE_LOOKUP: [u8; Q] = {
        let mut table = [0_u8; Q];

        // const phi = iPhi * 2 * Math.PI / Q
        // return Math.cos(phi) * 126.0 + 127.0
        for i_phi in 0..Q {
            let phi = (i_phi as f64)*2.0 * PI / (Q as f64);
            table[i_phi] = (phi.cos()*126.0+127.0) as u8;
        }

        table
    };
}
