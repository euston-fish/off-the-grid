#![feature(const_fn)]

extern { fn random() -> f64; }

const SIZE: usize = 1024;
const INITIAL_WATER_LEVEL: u8 = 64;

struct Game {
  terrain: [u8; SIZE * SIZE],
  water: [u8; SIZE * SIZE]
}

impl Game {
  const fn new() -> Game {
    Game {
      terrain: [0; SIZE * SIZE],
      water: [0; SIZE * SIZE]
    }
  }

  fn index(&self, x: u32, y: u32) -> usize {
    let size: u32 = SIZE as u32;
    ((x % size) * size + (y % size)) as usize
  }

  fn tick(&mut self) {
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
