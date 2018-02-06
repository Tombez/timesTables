// Please refer to https://www.youtube.com/watch?v=qhbuKbxJsk8 for more information.

// user variables
const num = 1000;
const increment = 0.002;
const pad = 5; // pixels
const colorLoop = 8; // loops before color loops.
const lineDensity = 0.3;

// variables
const framestep = 1000 / 60;
let r = Math.min(innerWidth, innerHeight) / 2 - pad;
let mult = 0;
let prev;
let canvas;
let ctx;
let points;

// main
document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    window.addEventListener("resize", () => requestAnimationFrame(resize));
    resize();
    prev = performance.now();
    draw();
});

// functions
CanvasRenderingContext2D.prototype.circle = function(_x, _y, _r) {
    this.moveTo(_x + _r, _y);
    this.arc(_x, _y, _r, 0, 2 * Math.PI);
};
const resize = () => {
    r = Math.min(innerWidth, innerHeight) / 2 - pad;
    canvas.width = canvas.height = (r + pad) * 2;
    ctx = canvas.getContext("2d");
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);

    points = new Array(num);
    for (let n = 0; n < num; n++) {
        points[n] = getPoint(n);
    }
};
const getPoint =  _index => {
    const angle = (_index / num) * 2 * Math.PI;
    return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
    };
};
const draw = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(-canvas.width/2, canvas.height/2, canvas.width, -canvas.height);

    ctx.beginPath(); // center point
    ctx.fillStyle = "#fff";
    ctx.circle(0, 0, 1);
    ctx.fill();

    ctx.beginPath(); // math lines
    ctx.lineWidth = (lineDensity * 2 * r) / num;
    ctx.strokeStyle = "hsl(" + Math.min(mult / colorLoop * 360) + ", 100%, 50%)";
    for (let n = 0; n < num; n++) {
        const src = points[n];
        const dst = getPoint(n * mult % num);
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(dst.x, dst.y);
    }
    ctx.stroke();

    ctx.beginPath(); // outer circle
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    let first = points[0];
    ctx.moveTo(first.x, first.y);
    for (let n = 1; n < num; n++) {
        const p = points[n];
        ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(first.x, first.y);
    ctx.stroke();

    const now = performance.now();
    mult += increment * ((now - prev) / framestep);
    prev = now;
    requestAnimationFrame(draw);
};
