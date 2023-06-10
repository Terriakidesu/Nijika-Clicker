
class FloatingText {

    constructor(x, y) {
        this.originX = x;
        this.originY = y;

        this.x = x + ((Math.random() * 2 - 1) * 10);
        this.y = y;

        this.maxDist = 120;

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

        let easing = 1 - Easing.easeInExpo(this.alpha);

        this.y = this.originY - (this.maxDist * easing);

        // let speed = lerp(0, c.height * 0.2, easing);

        // this.y -= dt * speed;


    }

}