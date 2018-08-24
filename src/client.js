import draw from './draw.js';
import { onActiveChanged, initializeToolbar, Instruction, getActiveInstructions } from './Instruction.js';
import LayerManager from './LayerManager.js';
import { add, sub, pixelToWorld } from './shared.js';

export default (function (DEBUG) {
  /* global io */
  window.addEventListener('load', () => {

    if (DEBUG) {
      window['debugParams'] = [];
    }

    let terrain = new LayerManager('/terrain');
    let water = new LayerManager('/water');

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
    let prev_mouse_location = null;
    let mouse_location = [-1, -1];
    let show_hover = false;

    let canvas = document.getElementById('c');
    let ctx = canvas.getContext('2d');
    let resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let origin = pixelToWorld(viewport_offset, [0, 0]);
      let size = sub(pixelToWorld(viewport_offset, [canvas.width, canvas.height]), origin);
      terrain.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
      water.setRegion(sub(origin, [5, 5]), add(size, [10, 10]));
    };
    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('mousedown', (event) => prev_mouse_location = [event.x, event.y]);
    canvas.addEventListener('mouseup', () => prev_mouse_location = null);
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
      }
      window.requestAnimationFrame(repaint);
    });

    initializeToolbar('toolbar');
    new Instruction('foobar').addToToolbar();
    new Instruction('barfoo').addToToolbar();
    onActiveChanged((activeButt) => {
      show_hover = activeButt != null;
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
      mouse_location,
      show_hover
    );

    let reload = () => {
      terrain.update().then(() => console.log(terrain)).then(repaint);
      water.update().then(() => console.log(terrain)).then(repaint);
      setTimeout(reload, 1000);
    };

    reload();

    bind();
  }, false);
});
