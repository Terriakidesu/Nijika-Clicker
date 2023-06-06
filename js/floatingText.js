
class FloatingText {

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.alpha = 1;
        this.lifetime = 0;
        this.maxLife = 100;
    }

    draw(ctx, size) {

        ctx.font = `${size}px Arial`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(0,0,0,${this.alpha})`;

        ctx.fillText("+1", this.x, this.y + (size / 2));

    }

    update(dt) {

        this.lifetime += this.lifetime >= this.maxLife ? 0 : dt * 100;

        this.alpha = clamp(1 - (this.lifetime / this.maxLife), 0, 1);

        let easing = Easing.easeOutCubic(this.alpha);
        let speed = lerp(0, c.height * 0.2, easing);

        this.y -= dt * speed;


    }

}