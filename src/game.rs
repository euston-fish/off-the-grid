#![feature(const_fn)]

extern {
  fn random() -> f64;
  fn log(v: i32);
}

const SIZE: u32 = 1024;
const INITIAL_WATER_LEVEL: i8 = 64;

struct Game {
  terrain: [i8; (SIZE * SIZE) as usize],
  water: [i8; (SIZE * SIZE) as usize]
}

fn rand_round(x: f32) -> i8 {
  let probability_high = x - x.floor();
  let rounded_down = x.floor() as i8;
  rounded_down + if (unsafe { random() } as f32) < probability_high { 1 } else { 0 }
}

fn flow_amounts(height_a: i8, height_b: i8, water_a: i8, water_b: i8) -> (i8, i8) {
  let saturated_a = water_a > height_a;
  let saturated_b = water_b > height_b;
  let flow_rate: f32 = (if saturated_a { 0.4 } else { 0.01 }) * (if saturated_b { 0.4 } else { 0.01 });
  let height_difference: f32 = water_a as f32 - water_b as f32;
  let water_flow_amount = flow_rate * height_difference;
  let erosion_flow_amount = if saturated_a && saturated_b { water_flow_amount * 0.0004 } else { 0.0 };
  (rand_round(water_flow_amount), rand_round(erosion_flow_amount))
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
    let mut erosion_count: i32 = 0;
    for c in 0..SIZE {
      for r in 0..SIZE {
        let a = self.index(c, r);
        let b = self.index(c+1, r);
        let c = self.index(c, r+1);
        let (flow_b, erosion_flow_b) = flow_amounts(self.terrain[a], self.terrain[b], self.water[a], self.water[b]);
        self.water[a] -= flow_b;
        self.water[b] += flow_b;
        self.terrain[a] -= erosion_flow_b;
        self.terrain[b] += erosion_flow_b;
        erosion_count += erosion_flow_b.abs() as i32;
        let (flow_c, erosion_flow_c) = flow_amounts(self.terrain[a], self.terrain[c], self.water[a], self.water[c]);
        self.water[a] -= flow_c;
        self.water[c] += flow_c;
        self.terrain[a] -= erosion_flow_b;
        self.terrain[c] += erosion_flow_c;
        erosion_count += erosion_flow_c.abs() as i32;
      }
    }
    unsafe { log(erosion_count); }
  }

  fn init(&mut self) {
    for mut cell in self.terrain.iter_mut() {
      *cell = (unsafe { random() } * 256.0 - 128.0) as i8;
    }
    //for mut cell in self.water.iter_mut() { *cell = INITIAL_WATER_LEVEL }
    for mut cell in self.water.iter_mut() {
      *cell = (unsafe { random() } * 256.0 - 128.0) as i8;
    }
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
