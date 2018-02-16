// user variables
const num = 1000;
const increment = 0.002;
const pad = 5; // pixels
const colorLoop = 8; // loops before color loops.
const lineDensity = 0.3;

const framestep = 1000 / 60;

const resize = () => {
    circ.resize(Math.min(innerWidth, innerHeight) / 2 - pad, lineDensity);
    canvas.width = canvas.height = (circ.r + pad) * 2;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);
};
const draw = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(-canvas.width / 2, canvas.height / 2, canvas.width, -canvas.height);

    circ.draw(ctx, colorLoop);

    const now = performance.now();
    circ.mult += increment * ((now - prev) / framestep);
    prev = now;
    requestAnimationFrame(draw);
};

let canvas;
let ctx;
let circ;
let prev;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    circ = new TimesCircle(num);
    window.addEventListener("resize", () => requestAnimationFrame(resize));
    resize();
    prev = performance.now();
    draw();
});
