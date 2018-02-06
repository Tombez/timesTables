// For why this pattern looks so cool, please refer to https://www.youtube.com/watch?v=qhbuKbxJsk8
// For circle-circle collision math, refer to http://ericleong.me/research/circle-circle/

// user variables
const lineNum = 1000;
const circleNum = 10;
const lineDensity = 1;
const increment = 0.002;
const colorLoop = 8; // loops before color loops.

// variables
const framestep = 1000 / 60;
let prevTime;
let prevR;
let prevWidth;
let prevHeight;
let canvas;
let ctx;
let timesCircles = [];
let ignoreStep = true;

// main
document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    prevR = Math.min(innerWidth, innerHeight);
    const largest = prevR / 4;
    const smallest = largest / 8;
    for (let n = 0; n < circleNum; n++) {
        const size = (largest - smallest) * 2 * (1 / (n + 2)) + smallest;
        timesCircles.push(new TimesCircle(Math.random() * innerWidth, Math.random() * innerHeight, size, Math.floor(lineNum * (size / (prevR / 3))), (n / (circleNum + 1)) * lineNum));
    }
    prevWidth = innerWidth;
    prevHeight = innerHeight;
    document.addEventListener("visibilitychange", () => document.hidden && (ignoreStep = true));
    window.addEventListener("resize", () => requestAnimationFrame(resize));
    resize();
    draw();
});

// classes
class TimesCircle {
    constructor(_x = 0, _y = 0, _r, _num, _mult = 0) {
        this.x = _x;
        this.y = _y;
        this.r = _r;
        this.num = _num;
        this.mult = _mult;
        this.vel = getPoint(Math.random());
        this.points;
        this.lineWidth;
        this.mass;
        this.resize(this.r);
    }
    resize(_r) {
        this.r = _r;
        this.mass = this.r ** 2;
        this.lineWidth = (lineDensity * 2 * this.r) / this.num;
        this.points = new Array(this.num);
        for (let n = 0; n < this.num; n++) {
            this.points[n] = getPoint(n / this.num, this.r);
        }
    }
    move(_timeMult) {
        this.x += this.vel.x * _timeMult;
        this.y += this.vel.y * _timeMult;
        if (this.x + this.r >= canvas.width) {
            this.x = canvas.width - this.r;
            this.vel.x *= -1;
        }
        if (this.x - this.r <= 0) {
            this.x = this.r;
            this.vel.x *= -1;
        }
        if (this.y + this.r >= canvas.height) {
            this.y = canvas.height - this.r;
            this.vel.y *= -1;
        }
        if (this.y - this.r <= 0) {
            this.y = this.r;
            this.vel.y *= -1;
        }
    }
    draw(_ctx, _color) {
        _ctx.translate(this.x, this.y);

        _ctx.beginPath(); // center point
        _ctx.fillStyle = "#fff";
        _ctx.circle(0, 0, 1);
        _ctx.fill();

        _ctx.beginPath(); // math lines
        _ctx.lineWidth = this.lineWidth;
        _ctx.strokeStyle = _color;
        for (let n = 0; n < this.num; n++) {
            const src = this.points[n];
            const dest = getPoint(n * this.mult / this.num, this.r);
            _ctx.moveTo(src.x, src.y);
            _ctx.lineTo(dest.x, dest.y);
        }
        _ctx.stroke();

        _ctx.beginPath(); // outer circle
        _ctx.lineWidth = 2;
        _ctx.strokeStyle = "#fff";
        let first = this.points[0];
        _ctx.moveTo(first.x, first.y);
        for (let n = 1; n < this.num; n++) {
            const p = this.points[n];
            _ctx.lineTo(p.x, p.y);
        }
        _ctx.lineTo(first.x, first.y);
        _ctx.stroke();

        _ctx.translate(-this.x, -this.y);
    }
}

// functions
const getPoint = (_percent, _r = 1) => {
    const angle = _percent * 2 * Math.PI;
    return {
        x: Math.cos(angle) * _r,
        y: Math.sin(angle) * _r
    };
};
const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height =window.innerHeight;
    ctx = canvas.getContext("2d");
    let r = Math.min(canvas.width, canvas.height);
    const rScale = r / prevR;
    const xScale = canvas.width / prevWidth;
    const yScale = canvas.height / prevHeight;
    for (let circ of timesCircles) {
        circ.resize(circ.r * rScale);
        circ.x *= xScale;
        circ.y *= yScale;
    }
    prevR = r;
    prevWidth = innerWidth;
    prevHeight = innerHeight;
};
const draw = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const now = performance.now();
    const timeMult = ignoreStep ? 1 : (now - prevTime) / framestep;
    ignoreStep = false;
    prevTime = now;
    for (let circ of timesCircles) {
        circ.mult += increment * timeMult;
        circ.move(timeMult);
    }
    for (let a = 0; a < timesCircles.length; a++) {
        const ca = timesCircles[a];
        for (let b = a + 1; b < timesCircles.length; b++) {
            const cb = timesCircles[b];
            if ((ca.x - cb.x) ** 2 + (ca.y - cb.y) ** 2 <= (ca.r + cb.r) ** 2 && !(ca.x == cb.x && ca.y == cb.y)) {
                const massPercent = ca.mass / (ca.mass + cb.mass);
                const cdist = Math.hypot(ca.x - cb.x, ca.y - cb.y);
                const oad = cdist / cb.r;
                const oa = {
                    x: cb.x + (ca.x - cb.x) / oad,
                    y: cb.y + (ca.y - cb.y) / oad
                };
                const obd = cdist / ca.r;
                const ob = {
                    x: ca.x + (cb.x - ca.x) / obd,
                    y: ca.y + (cb.y - ca.y) / obd
                };
                const mid = {
                    x: oa.x + (ob.x - oa.x) * massPercent,
                     y: oa.y + (ob.y - oa.y) * massPercent
                };

                ca.x += mid.x - ob.x;
                ca.y += mid.y - ob.y;
                cb.x += mid.x - oa.x;
                cb.y += mid.y - oa.y;

                const dist = ca.r + cb.r;
                const nx = (cb.x - ca.x) / dist;
                const ny = (cb.y - ca.y) / dist;
                const bounce = 2 * (ca.vel.x * nx + ca.vel.y * ny - cb.vel.x * nx - cb.vel.y * ny) / (ca.mass + cb.mass);
                ca.vel.x = ca.vel.x - bounce * cb.mass * nx;
                ca.vel.y = ca.vel.y - bounce * cb.mass * ny;
                cb.vel.x = cb.vel.x + bounce * ca.mass * nx;
                cb.vel.y = cb.vel.y + bounce * ca.mass * ny;
            }
        }
    }
    for (let circ of timesCircles) {
        circ.draw(ctx, "hsl(" + circ.mult / colorLoop * 360 + ", 100%, 50%)");
    }

    requestAnimationFrame(draw);
};
CanvasRenderingContext2D.prototype.circle = function(_x, _y, _r) {
    this.moveTo(_x + _r, _y);
    this.arc(_x, _y, _r, 0, 2 * Math.PI);
};
