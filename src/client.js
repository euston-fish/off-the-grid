import draw from './draw.js';
import { onActiveChanged, initializeToolbar, Instruction, getActiveInstructions } from './Instruction.js';
import LayerManager from './LayerManager.js';
import { add, sub, pixelToWorld, magnitude } from './shared.js';

export default (function (DEBUG) {
  /* global io */
  window.addEventListener('load', () => {

    if (DEBUG) {
      window['debugParams'] = [];
    }

    let terrain = new LayerManager('/terrain');
    let water = new LayerManager('/water');
    let vegetation = new LayerManager('/vegetation');

    let socket;

    let bind = () => {
      socket.on('start', () => {
        console.log('Started');
      });

      socket.on('connect', () => {
        console.log('Connected');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected');
      });

      socket.on('error', () => {
        console.log('Oh shit');
      });

      // socket.emit('guess', guess);
    };

    socket = io({ upgrade: false, transports: ['websocket'] });

    let viewport_offset = [0, 0];
    let click_start_location = null;
    let prev_mouse_location = null;
    let mouse_location = [-1, -1];
    let active_instruction = null;

    let canvas = document.getElementById('c');
    let ctx = canvas.getContext('2d');
    let resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let origin = pixelToWorld(viewport_offset, [0, 0]);
      let size = sub(pixelToWorld(viewport_offset, [canvas.width, canvas.height]), origin);
      terrain.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
      water.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
      vegetation.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
    };
    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('mousedown', (event) => {
      prev_mouse_location = [event.x, event.y];
      click_start_location = prev_mouse_location;
    });
    canvas.addEventListener('mouseup', () => {
      let dist = magnitude(sub(prev_mouse_location, click_start_location));
      if (dist < 5 && active_instruction) {
        let [x, y] = pixelToWorld(viewport_offset, prev_mouse_location);
        if (active_instruction.canApplyTo({'vegetation': vegetation.get([x, y]), 'water': water.get([x, y]), 'terrain': terrain.get([x, y])})) {
          active_instruction.placed();
          let placed_instruction = active_instruction;
          active_instruction = null;
          fetch(`/place_instruction/${x}/${y}/${placed_instruction.code}/${placed_instruction.impact}`)
            // .then(response => response.json())
            .then(() => placed_instruction.remove());
        }
      }
      prev_mouse_location = null;
    });
    canvas.addEventListener('mousemove', (event) => {
      mouse_location = [event.x, event.y];
      if (prev_mouse_location) {
        let delta = [event.x, event.y].sub(prev_mouse_location);
        viewport_offset = viewport_offset.sub(delta);
        prev_mouse_location = mouse_location;

        let origin = pixelToWorld(viewport_offset, [0, 0]);
        let size = sub(pixelToWorld(viewport_offset, [canvas.width, canvas.height]), origin);
        terrain.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
        water.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
        vegetation.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
      }
      window.requestAnimationFrame(repaint);
    });

    initializeToolbar('toolbar');
    onActiveChanged((activeButt) => {
      active_instruction = activeButt;
    });

    setInterval(() => {
      if (getActiveInstructions().length < 5) {
        Instruction.randomInstruction().addToToolbar();
      }
    }, 5000);

    let repaint = () => draw(
      ctx,
      canvas,
      viewport_offset,
      terrain,
      water,
      vegetation,
      mouse_location,
      active_instruction
    );

    let reload = () => {
      terrain.update().then(repaint);
      water.update().then(repaint);
      vegetation.update().then(repaint);
      setTimeout(reload, 1000);
    };

    reload();

    bind();
  }, false);
});
