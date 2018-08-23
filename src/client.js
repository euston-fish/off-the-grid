import BlockManager from './BlockManager.js';
import draw from './draw.js';
import { onActiveChanged, initializeToolbar, Instruction, getActiveInstructions } from './Instruction.js';

export default (function (DEBUG) {
  /* global io */
  window.addEventListener('load', () => {

    if (DEBUG) {
      window['debugParams'] = [];
    }

    let socket;

    let blockManager = new BlockManager();

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
    let canvas = document.getElementById('c');
    let ctx = canvas.getContext('2d');
    let resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let viewport_offset = [0, 0];
    let prev_mouse_location = null;
    let mouse_location = [-1, -1];
    let show_hover = false;

    let repaint = () => draw(
      ctx,
      canvas,
      viewport_offset,
      blockManager,
      mouse_location,
      show_hover
    );
    blockManager.addEventListener('update',
      () => window.requestAnimationFrame(repaint));

    canvas.addEventListener('mousedown', (event) => prev_mouse_location = [event.x, event.y]);
    canvas.addEventListener('mouseup', () => prev_mouse_location = null);
    canvas.addEventListener('mousemove', (event) => {
      mouse_location = [event.x, event.y];
      if (prev_mouse_location) {
        let delta = [event.x, event.y].sub(prev_mouse_location);
        viewport_offset = viewport_offset.sub(delta);
        prev_mouse_location = mouse_location;
        viewport_offset = viewport_offset.map(c => Math.max(c, 0));
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

    bind();
    repaint();
  }, false);
});
