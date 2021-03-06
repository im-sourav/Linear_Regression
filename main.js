const cvs = document.getElementById("cvs");
const btn = document.getElementById("btn");
const ctx = cvs.getContext("2d");
let w = cvs.width,
  h = cvs.height;
let Points = [];

const update = () => {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  // formula = Y = mx + c
  let min = {
      x: 0,
      y: 0,
    },
    X_x_INTU_Y_y = [],
    sums = {
      S1: 0,
      S2: 0,
    },
    path = [],
    m,
    c;

  // points
  for (let i = 0; i < Points.length; i++) {
    let x = Points[i].x,
      y = Points[i].y;
    ctx.beginPath();
    ctx.fillStyle = "#00ffff";
    ctx.arc(x, y, 100, 0, Math.PI * 2, false);
    ctx.fill();
    draw_points_text(x, y, "#fff");
  }

  // find the min of grap
  if (Points.length > 1) {
    for (let i = 0; i < Points.length; i++) {
      min.x += Points[i].x;
      min.y += Points[i].y;
    }
    min.x = min.x / Points.length;
    min.y = min.y / Points.length;

    //   find the X_x_INTU_Y_y and X_x_sqr
    for (let i = 0; i < Points.length; i++) {
      let x = Points[i].x - min.x,
        y = Points[i].y - min.y;
      X_x_INTU_Y_y.push({ mul: x * y, sqr: x * x });
    }

    // calclute sum of X_x_INTU_Y_y and X_x_sqr
    for (let i = 0; i < Points.length; i++) {
      sums.S1 += X_x_INTU_Y_y[i].mul;
      sums.S2 += X_x_INTU_Y_y[i].sqr;
    }
    m = sums.S1 / sums.S2;
    c = min.y - m * min.x;

    // find the all paths y
    for (let i = 0; i < Points.length; i++) {
      path.push(m * Points[i].x + c);
    }

    // draw linear line
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 50;
    ctx.beginPath();
    ctx.moveTo(Points[0].x, path[0]);
    let array = Points.map((e) => e.x);
    let minX = Math.min(...array);
    let maxX = Math.max(...array);
    let maxI = Points.map((e, i) => (e.x == maxX ? i : 0));

    for (let i = 1; i < Points.length; i++) {
      ctx.lineTo(Points[i].x, path[i]);
      if(path[Math.max(...maxI)] != path[i]){
        draw_points_text(Points[i].x, path[i], "#f00");
      }
    }
    ctx.stroke();

    // draw cnaction
    for (let i = 0; i < Points.length; i++) {
      ctx.strokeStyle = "#fff000";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(Points[i].x, Points[i].y);
      ctx.lineTo(Points[i].x, path[i]);
      ctx.stroke();
    }

    draw_points_text(maxX, path[Math.max(...maxI)] - 100, "#00f");
    draw_points_text(minX, path[0] - 100, "#00f");

  }
};

// draw text
function draw_points_text(x, y, color) {
  ctx.font = "70px Arial";
  ctx.fillStyle = color;
  ctx.fillText(
    `(${Math.floor(x / 100)}, ${Math.floor(y / 100)})`,
    x,
    y - 100
  );
}

update();
cvs.addEventListener("click", (e) => {
  let persentX = (e.offsetX * 100) / cvs.clientWidth,
    persentY = (e.offsetY * 100) / cvs.clientHeight;
  let clickPointX = (cvs.width * persentX) / 100,
    clickPointY = (cvs.height * persentY) / 100;
  Points.push({ x: clickPointX, y: clickPointY });
  update();
});

const restart = () => {
  Points = [];
  ctx.clearRect(0, 0, w, h);
};
btn.addEventListener("click", () => {
  restart();
  update();
});
