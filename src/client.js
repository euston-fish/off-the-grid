'use strict';
/*global io*/

window.addEventListener('load', () => {
  const SIZE = 1024,
    W = 20;
  let socket;
  let to_index = (a) => Math.floor(a / W);

  let get_view_range = ([x, y], [w, h]) => [
    [to_index(x), to_index(y)], [to_index(x + w), to_index(y + h)]];

  let generate_map = () => {
    let array = new Uint8Array(SIZE * SIZE);
    array.forEach((_, idx) => {
      array[idx] = Math.floor(Math.random() * 255);
    });
    return array;
  };
  let elevation = generate_map();

  let get_at = (array, [x, y]) => array[(y * SIZE) + x];

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
  let draw = () => {
    let [[xs, ys], [xe, ye]] = get_view_range(viewport_offset,
      [canvas.width, canvas.height]);

    for (let x = xs; x < xe; x++) {
      for (let y = ys; y < ye; y++) {
        let height = get_at(elevation, [x, y]);
        ctx.fillStyle = 'rgb(' + height + ',' + height + ',' + height + ')';
        ctx.fillRect(W * x, W * y, W * (x + 1), W * (y + 1));
      }
    }
    window.requestAnimationFrame(draw);
  };

  bind();
  draw();
}, false);
