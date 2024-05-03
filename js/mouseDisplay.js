
class MouseDisplay {

    state = 0;

    constructor() {

        this.images = [
            Preloader.PreloadedAssets.Images["assets/Images/Mouse/mouse_black_1.png"],
            Preloader.PreloadedAssets.Images["assets/Images/Mouse/mouse_black_2.png"]
        ];
    }

    setState(state) {
        this.state = state;
    }

    draw(ctx) {
        let size = Math.floor(c.width * 0.1)
        ctx.drawImage(this.images[this.state], 0, c.height - size, size, size);
    }
}