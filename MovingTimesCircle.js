class MovingTimesCircle extends TimesCircle {
    constructor(num, mult, x, y) {
        super(num, mult);
        this.x = x;
        this.y = y;
        this.vel = getPoint(Math.random());
        this.mass;
    }
    resize(r) {
        super.resize(r, 1);
        this.mass = this.r ** 2;
    }
    move(timeMult) {
        this.x += this.vel.x * timeMult;
        this.y += this.vel.y * timeMult;
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
    draw(ctx, color) {
        ctx.translate(this.x, this.y);
        super.draw(ctx, colorLoop);
        ctx.translate(-this.x, -this.y);
    }
}
