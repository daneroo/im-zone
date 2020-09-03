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
    offset: f64,
) -> Result<(), JsValue> {
    // The real workhorse of this algorithm, generating pixel data
    let mut data = get_zoneplate(width, height, offset);
    let data = ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut data), width, height)?;
    ctx.put_image_data(&data, 0.0, 0.0)
}

fn get_zoneplate(width: u32, height: u32, offset: f64) -> Vec<u8> {
    let mut data: Vec<u8> = vec![127; (width * height * 4) as usize];
    // let mut data = Vec::new();

    let cx = width as i32 / 2;
    let cy = height as i32 / 2;

    let mut index = 0;
    for j in -cy..cy {
        // let y: f64 = ((j as f64) - cy) / (height as f64);
        let y2 = (j * j) as f64 / height as f64;
        for i in -cx..cx {
            // let x: f64 = ((i as f64) - cx) / (width as f64);
            let x2 = (i * i) as f64 / height as f64;
            // let phi: f64 = x * x * width as f64 + y * y * height as f64;
            let phi: f64 = x2 + y2 + offset;

            let c = (phi * PI).sin() * 126.0 + 127.0;
            // let index: usize = ((j * width + i) * 4) as usize;
            data[index + 0] = c as u8;
            data[index + 1] = c as u8;
            data[index + 2] = c as u8;
            data[index + 3] = 255;
            index += 4;
        }
    }

    data
}
