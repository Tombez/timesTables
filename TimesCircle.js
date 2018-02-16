Math.tau = 2 * Math.PI;
class TimesCircle {
    constructor(num, mult = 0) {
        this.num = num;
        this.mult = mult;
        this.r;
        this.points;
        this.lineWidth;
    }
    resize(r, lineDensity) {
        this.r = r;
        this.lineWidth = (lineDensity * 2 * this.r) / this.num;
        this.points = new Float32Array(this.num * 2);
        for (let n = 0; n < this.num;) {
            const angle = (n / this.num) * Math.tau;
            this.points[n++] = Math.cos(angle) * r;
            this.points[n++] = Math.sin(angle) * r;
        }
    }
    draw(ctx, colorLoop) {
        ctx.beginPath(); // center point
        ctx.fillStyle = "#fff";
        ctx.moveTo(1, 0);
        ctx.arc(0, 0, 1, 0, Math.tau);
        ctx.fill();

        ctx.beginPath(); // math lines
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = `hsl(${this.mult % colorLoop / colorLoop * 360}, 100%, 50%)`;
        for (let n = 0; n < this.num;) {
            const angle = (n * this.mult / this.num % 1) * Math.tau;
            ctx.moveTo(this.points[n++], this.points[n++]);
            ctx.lineTo(Math.cos(angle) * this.r, Math.sin(angle) * this.r);
        }
        ctx.stroke();

        ctx.beginPath(); // outer circle
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.arc(0, 0, this.r, 0, Math.tau);
        ctx.stroke();
    }
}
