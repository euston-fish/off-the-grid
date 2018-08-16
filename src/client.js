export default (function () {
  /*global io*/
  window.addEventListener('load', () => {
    const SIZE = 1024,
      W = 34;
    let add = ([x, y], [z, w]) => [x+z, y+w],
        inv = ([x, y]) => [-x, -y],
        sub = (a, b) => add(a, inv(b)),
        normal = (uniform_1, uniform_2) => Math.sqrt(-2 * Math.log(uniform_1)) * Math.cos(2 * Math.PI * uniform_2);

    let socket;
    let to_index = (a) => Math.floor(a / W);

    let get_view_range = ([x, y], [w, h]) => [
      [to_index(x), to_index(y)], [to_index(x + w), to_index(y + h)]];

    let generate_map = () => {
      let array = new Uint8Array(SIZE * SIZE);
      array.forEach((_, idx) => {
        array[idx] = Math.floor(normal(Math.random(), Math.random()) * 128);
      });
      return array;
    };
    let elevation = generate_map();

    let objects = [
      [12, 23, '#ff0000'],
    ]


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
    let base_canvas = document.getElementById('c');
    let base_ctx = base_canvas.getContext('2d');
    let detail_canvas = document.getElementById('a');
    let detail_ctx = detail_canvas.getContext('2d');
    let resize = () => {
      let grid_width = Math.ceil(window.innerWidth / W) + 1;
      let grid_height = Math.ceil(window.innerHeight / W) + 1;
      base_canvas.width = grid_width;
      base_canvas.height = grid_height;
      base_canvas.style.width = grid_width * W + 'px';
      base_canvas.style.height = grid_height * W + 'px';
      detail_canvas.width = window.innerWidth;
      detail_canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let viewport_offset = [0, 0];
    let prev_mouse_location = null;

    detail_canvas.addEventListener('mousedown', (event) => prev_mouse_location = [event.x, event.y]);
    detail_canvas.addEventListener('mouseup', (event) => prev_mouse_location = null);
    detail_canvas.addEventListener('mousemove', (event) => {
      if (prev_mouse_location) {
        let new_offset = [event.x, event.y];
        let offset = sub(new_offset, prev_mouse_location);
        viewport_offset = sub(viewport_offset, offset);
        prev_mouse_location = new_offset;
        window.requestAnimationFrame(draw);
      }
    });
    let draw = () => {
      base_ctx.clearRect(0, 0, base_canvas.width, base_canvas.height);
      detail_ctx.clearRect(0, 0, detail_canvas.width, detail_canvas.height);
      let [[xs, ys], [xe, ye]] = get_view_range(viewport_offset,
        [base_canvas.width * W, base_canvas.height * W]);
      let [ox, oy] = [viewport_offset[0] % W, viewport_offset[1] % W];
      base_canvas.style.left = -ox + 'px';
      base_canvas.style.top = -oy + 'px';
      ye++;
      xe++;
      for (let x = xs; x < xe; x++) {
        for (let y = ys; y < ye; y++) {
          let height = get_at(elevation, [x, y]);
          base_ctx.fillStyle = 'rgb(' + height + ',' + height + ',' + height + ')';
          base_ctx.fillRect(
            x - xs,
            y - ys,
            1,
            1,
          );
        }
      }
      objects.forEach(([x, y, color]) => {
        detail_ctx.fillStyle = color;
        console.log(x, y, color)
        detail_ctx.fillRect(
          W * (x - xs),
          W * (y - ys),
          W,
          W,
        );
      })
      detail_ctx.fillText([xs, ys].toString(), 5, 15);
    };

    bind();
    draw();
  }, false);
})
