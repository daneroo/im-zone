use std::f64::consts::PI;
use std::ops::Add;
use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;
use web_sys::{CanvasRenderingContext2d, ImageData};

#[wasm_bindgen]
pub fn draw(
    ctx: &CanvasRenderingContext2d,
    width: u32,
    height: u32,
    real: f64,
    imaginary: f64,
) -> Result<(), JsValue> {
    // The real workhorse of this algorithm, generating pixel data
    let mut data = get_zoneplate(width, height);
    // let c = Complex { real, imaginary };
    // let mut data = get_julia_set(width, height, c);
    let data = ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut data), width, height)?;
    ctx.put_image_data(&data, 0.0, 0.0)
}

fn get_zoneplate(width: u32, height: u32) -> Vec<u8> {
    let mut data: Vec<u8> = vec![127; (width * height * 4) as usize];
    // let mut data = Vec::new();

    // let cx: f64 = width as f64 / 2.0;
    // let cy: f64 = height as f64 / 2.0;
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
            let phi: f64 = x2 + y2;

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

fn get_julia_set(width: u32, height: u32, c: Complex) -> Vec<u8> {
    let mut data = Vec::new();

    let param_i = 1.5;
    let param_r = 1.5;
    let scale = 0.005;

    for x in 0..width {
        for y in 0..height {
            let z = Complex {
                real: y as f64 * scale - param_r,
                imaginary: x as f64 * scale - param_i,
            };
            let iter_index = get_iter_index(z, c);
            data.push((iter_index / 4) as u8);
            data.push((iter_index / 2) as u8);
            data.push(iter_index as u8);
            data.push(255);
        }
    }

    data
}

fn get_iter_index(z: Complex, c: Complex) -> u32 {
    let mut iter_index: u32 = 0;
    let mut z = z;
    while iter_index < 900 {
        if z.norm() > 2.0 {
            break;
        }
        z = z.square() + c;
        iter_index += 1;
    }
    iter_index
}

#[derive(Clone, Copy, Debug)]
struct Complex {
    real: f64,
    imaginary: f64,
}

impl Complex {
    fn square(self) -> Complex {
        let real = (self.real * self.real) - (self.imaginary * self.imaginary);
        let imaginary = 2.0 * self.real * self.imaginary;
        Complex { real, imaginary }
    }

    fn norm(&self) -> f64 {
        (self.real * self.real) + (self.imaginary * self.imaginary)
    }
}

impl Add<Complex> for Complex {
    type Output = Complex;

    fn add(self, rhs: Complex) -> Complex {
        Complex {
            real: self.real + rhs.real,
            imaginary: self.imaginary + rhs.imaginary,
        }
    }
}
