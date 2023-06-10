
class Dorito {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.alpha = 1;
        this.scale = 1;
        this.size = 1;
        this.angle = 0;
        this.forceAngle = 0;
        this.damping = 0.99;

        this.lifetime = 0;
        this.maxLifetime = 100;
        this.image = new Image();
        this.image.src = "assets/Images/Dorito.png";

        this.alive = false;
        this.rotReverse = false;
        this.userForce = true;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setRotateReverse(x) {
        this.rotReverse = x;
    }

    setSize(size) {
        this.size = size;
    }

    setScale(scale) {
        this.scale = scale;
    }

    setAngle(angle) {
        this.angle = angle;
    }

    setForceAngle(angle) {
        this.forceAngle = angle;

        let magnitude = 4;

        this.fx = Math.cos(this.forceAngle) * magnitude;
        this.fy = Math.sin(this.forceAngle) * magnitude;
    }


    draw(ctx) {
        if (!this.alive) return;


        ctx.save();
        ctx.globalAlpha = this.alpha;

        let size = this.size * this.scale

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle)
        ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    update(dt) {
        if (!this.alive) return

        let f = 200 * this.scale;


        this.x += this.fx * dt * f;
        this.y += this.fy * dt * f;

        this.fx *= this.damping;
        this.fy *= this.damping;


        this.y += dt * 2 * f;

        let easing = Easing.easeInQuint(this.alpha);

        if (this.rotReverse) {
            this.angle -= dt * lerp(2, 20, easing);
        } else {
            this.angle += dt * lerp(2, 20, easing);
        }

        this.lifetime += this.lifetime < this.maxLifetime ? dt * 40 : 0;

        this.alpha = clamp(1 - (this.lifetime / this.maxLifetime), 0, 1);

        this.scale = lerp(this.scale, 0, dt * 0.25)

        if (this.lifetime > this.maxLifetime) {
            this.alive = false;
        }
    }
}

