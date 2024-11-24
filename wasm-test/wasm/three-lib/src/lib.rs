use wasm_bindgen::prelude::*;
use rand::Rng;

#[wasm_bindgen]
pub struct ParticleSystem {
    positions: Vec<f32>,
    velocities: Vec<f32>,
}

#[wasm_bindgen]
impl ParticleSystem {
    #[wasm_bindgen(constructor)]
    pub fn new(count: usize) -> ParticleSystem {
        let mut rng = rand::thread_rng();
        let mut positions = Vec::with_capacity(count * 3);
        let mut velocities = Vec::with_capacity(count * 3);

        for _ in 0..count {
            positions.push((rng.gen::<f32>() - 0.5) * 10.0);
            positions.push((rng.gen::<f32>() - 0.5) * 10.0);
            positions.push((rng.gen::<f32>() - 0.5) * 10.0);

            velocities.push((rng.gen::<f32>() - 0.5) * 2.0);
            velocities.push((rng.gen::<f32>() - 0.5) * 2.0);
            velocities.push((rng.gen::<f32>() - 0.5) * 2.0);
        }

        ParticleSystem {
            positions,
            velocities,
        }
    }

    pub fn get_positions_ptr(&self) -> *const f32 {
        self.positions.as_ptr()
    }

    pub fn get_velocities_ptr(&self) -> *const f32 {
        self.velocities.as_ptr()
    }

    pub fn update_positions(&mut self, delta_time: f32) {
        let count = self.positions.len() / 3;

        for i in 0..count {
            let idx = i * 3;

            self.positions[idx] += self.velocities[idx] * delta_time;
            self.positions[idx + 1] += self.velocities[idx + 1] * delta_time;
            self.positions[idx + 2] += self.velocities[idx + 2] * delta_time;

            self.velocities[idx + 1] -= 9.81 * delta_time;

            if self.positions[idx + 1] < -5.0 {
                self.positions[idx + 1] = -5.0;
                self.velocities[idx + 1] *= -0.5;
            }
        }
    }
}
