

class Background {

    constructor() {
        this.images = [
            new Image(),
            new Image()
        ];

        this.images[0].src = "assets/Images/Background/dorito_bg_1.png";
        this.images[1].src = "assets/Images/Background/dorito_bg_2.png";

        this.elapsedTime = 0;

        this.position = { x: 0, y: 0 };
    }

    draw(ctx) {

        ctx.save();
        ctx.fillStyle = "rgb(241,213,81)";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.restore();

        ctx.save();

        ctx.globalAlpha = 0.6;

        for (let i = 0; i < 4; i++) {

            let x = Math.floor(i / 2);
            let y = i % 2;

            let frame = Math.floor(this.elapsedTime) % 2;

            ctx.drawImage(this.images[frame], this.position.x - (c.width * x), this.position.y - (c.height * y), c.width, c.height);
        }

        ctx.restore();
    }

    update(dt) {

        this.elapsedTime += dt * 2;

        this.position.y += c.height * 0.05 * dt;
        this.position.x += c.width * 0.05 * dt;

        if (this.position.y >= c.height) {
            this.position.y = 0;
        }
    
        if (this.position.x >= c.width) {
            this.position.x = 0;
        }
    }
}