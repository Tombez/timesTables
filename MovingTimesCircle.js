class MovingTimesCircle extends TimesCircle {
    constructor(num, mult, x, y) {
        super(num, mult);
        this.x = x;
        this.y = y;
        this.vel = getPoint(Math.random());
        this.mass;
    }
    resize(r, lineDensity) {
        super.resize(r, lineDensity);
        this.mass = this.r ** 2;
    }
    move(delta) {
        this.x += this.vel.x * delta;
        this.y += this.vel.y * delta;
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
    draw(ctx, colorLoop) {
        ctx.translate(this.x, this.y);
        super.draw(ctx, colorLoop);
        ctx.translate(-this.x, -this.y);
    }
    static doOverlap(a, b) {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 <= (a.r + b.r) ** 2;
    }
    static collisionCorrect(a, b) {
        const massPercent = a.mass / (a.mass + b.mass);
        const cdist = Math.hypot(a.x - b.x, a.y - b.y);
        const oad = cdist / b.r;
        const oa = {
            x: b.x + (a.x - b.x) / oad,
            y: b.y + (a.y - b.y) / oad
        };
        const obd = cdist / a.r;
        const ob = {
            x: a.x + (b.x - a.x) / obd,
            y: a.y + (b.y - a.y) / obd
        };
        const mid = {
            x: oa.x + (ob.x - oa.x) * massPercent,
            y: oa.y + (ob.y - oa.y) * massPercent
        };

        a.x += mid.x - ob.x;
        a.y += mid.y - ob.y;
        b.x += mid.x - oa.x;
        b.y += mid.y - oa.y;

        const dist = a.r + b.r;
        const nx = (b.x - a.x) / dist;
        const ny = (b.y - a.y) / dist;
        const bounce = 2 * (a.vel.x * nx + a.vel.y * ny - b.vel.x * nx - b.vel.y * ny) / (a.mass + b.mass);
        a.vel.x = a.vel.x - bounce * b.mass * nx;
        a.vel.y = a.vel.y - bounce * b.mass * ny;
        b.vel.x = b.vel.x + bounce * a.mass * nx;
        b.vel.y = b.vel.y + bounce * a.mass * ny;
    }
}
