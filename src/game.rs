#![feature(const_fn)]

extern { fn random() -> f64; }

const SIZE: u32 = 1024;
const INITIAL_WATER_LEVEL: u8 = 64;

struct Game {
  terrain: [u8; (SIZE * SIZE) as usize],
  water: [u8; (SIZE * SIZE) as usize]
}

fn flow_amount(height_a: u8, height_b: u8, water_a: u8, water_b: u8) -> f32 {
  let saturated_a = water_a > height_a;
  let saturated_b = water_b > height_b;
  let flow_rate: f32 = (if saturated_a { 0.4 } else { 0.01 }) * (if saturated_b { 0.4 } else { 0.01 });
  let height_difference: f32 = height_a as f32 - height_b as f32;
  flow_rate * height_difference
}

impl Game {
  const fn new() -> Game {
    Game {
      terrain: [0; (SIZE * SIZE) as usize],
      water: [0; (SIZE * SIZE) as usize]
    }
  }

  fn index(&self, c: u32, r: u32) -> usize {
    ((c % SIZE) * SIZE + (r % SIZE)) as usize
  }

  fn tick(&mut self) {
    for c in 0..SIZE {
      for r in 0..SIZE {
        let a = self.index(c, r);
        let b = self.index(c+1, r);
        let c = self.index(c, r+1);
        let flow_b = flow_amount(self.terrain[a], self.terrain[b], self.water[a], self.water[b]);
        self.water[a] -= flow_b as u8;
        self.water[b] += flow_b as u8;
        let flow_c = flow_amount(self.terrain[a], self.terrain[c], self.water[a], self.water[c]);
        self.water[a] -= flow_c as u8;
        self.water[c] += flow_c as u8;
      }
    }
  }

  fn init(&mut self) {
    for mut cell in self.terrain.iter_mut() {
      *cell = (unsafe { random() } * 256.0) as u8;
    }
    for mut cell in self.water.iter_mut() { *cell = INITIAL_WATER_LEVEL }
  }
}

static mut GAME: Game = Game::new();

#[no_mangle]
pub fn init() {
  unsafe { GAME.init(); }
}

#[no_mangle]
pub fn tick() {
  unsafe { GAME.tick(); }
}

#[no_mangle]
pub fn address() -> u32 {
  unsafe { (&GAME as *const _) as u32 }
}
