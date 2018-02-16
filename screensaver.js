// For why this pattern looks so cool, please refer to https://www.youtube.com/watch?v=qhbuKbxJsk8
// For circle-circle collision math, refer to http://ericleong.me/research/circle-circle/

// user variables
const lineNum = 1000;
const circleNum = 10;
const increment = 0.002;
const lineDensity = 0.8;
const colorLoop = 8; // loops before color loops.

const framestep = 1000 / 60;
Math.tau = 2 * Math.PI;

const getPoint = (_percent, _r = 1) => {
    const angle = _percent * Math.tau;
    return {
        x: Math.cos(angle) * _r,
        y: Math.sin(angle) * _r
    };
};
const resize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let r = Math.min(canvas.width, canvas.height);
    const rScale = r / prevR;
    const xScale = canvas.width / prevWidth;
    const yScale = canvas.height / prevHeight;
    for (let circ of timesCircles) {
        circ.resize(circ.r * rScale, lineDensity);
        circ.x *= xScale;
        circ.y *= yScale;
    }
    prevR = r;
    prevWidth = innerWidth;
    prevHeight = innerHeight;
};
const visibilityChange = () => prevTime = performance.now();
const initCircs = () => {
    const largest = prevR / 4;
    const smallest = largest / 8;
    for (let n = 0; n < circleNum; n++) {
        const size = (largest - smallest) * 2 * (1 / (n + 2)) + smallest;
        const circ = new MovingTimesCircle(Math.floor(lineNum * (size / (prevR / 3))), (n / (circleNum + 1)) * lineNum, Math.random() * innerWidth, Math.random() * innerHeight);
        circ.resize(size);
        timesCircles.push(circ);
    }
};
const loop = now => {
    step((now - prevTime) / framestep);
    draw();
    prevTime = now;
    requestAnimationFrame(loop);
};
const step = delta => {
    for (let circ of timesCircles) {
        circ.mult += increment * delta;
        circ.move(delta);
    }
    for (let n = 0; n < timesCircles.length; n++) {
        const a = timesCircles[n];
        for (let i = n + 1; i < timesCircles.length; i++) {
            const b = timesCircles[i];
            if (MovingTimesCircle.doOverlap(a, b)) {
                MovingTimesCircle.collisionCorrect(a, b);
            }
        }
    }
};
const draw = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let circ of timesCircles) {
        circ.draw(ctx, colorLoop);
    }
};

let prevTime;
let prevR;
let prevWidth;
let prevHeight;
let canvas;
let ctx;
let timesCircles = [];
let ignoreStep = true;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    prevR = Math.min(innerWidth, innerHeight);
    prevWidth = innerWidth;
    prevHeight = innerHeight;
    initCircs();
    document.addEventListener("visibilitychange", visibilityChange);
    visibilityChange();
    window.addEventListener("resize", () => requestAnimationFrame(resize));
    resize();
    requestAnimationFrame(loop);
});
