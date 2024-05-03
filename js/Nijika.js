

class Nijika {

    state = 0;

    imageNames = [
        "assets/Images/Nijika/Nijika_1.png",
        "assets/Images/Nijika/Nijika_1_r.png",
        "assets/Images/Nijika/Nijika_1_g.png",
        "assets/Images/Nijika/Nijika_1_b.png",
        "assets/Images/Nijika/Nijika_1_gray.png",
        "assets/Images/Nijika/Nijika_2.png",
        "assets/Images/Nijika/Nijika_2_r.png",
        "assets/Images/Nijika/Nijika_2_g.png",
        "assets/Images/Nijika/Nijika_2_b.png",
        "assets/Images/Nijika/Nijika_2_gray.png"
    ];

    images = {};
    position = { x: 0, y: 0 };

    size = {
        width: 1920,
        height: 1080
    };

    tint = 0;
    multiplier = 0;
    startEffect = false;

    constructor() {

        this.loadImages();

        this.audio = Preloader.PreloadedAssets.Audios["assets/Audio/pop-39222.wav"];
        this.audio.volume = 0.8;

    }

    loadImages() {

        for (let i = 0; i < 2; i++) {

            this.images[i] = [];

            for (let j = 0; j < 5; j++) {

                this.images[i].push(Preloader.PreloadedAssets.Images[this.imageNames[(5 * i) + j]]);
            }

        }


    }

    toggleState() {
        this.state == this.state == 1 ? 0 : 1;
    }

    setState(state) {
        this.state = state;
    }

    start() {
        this.startEffect = true;
    }

    stop() {
        this.startEffect = false;
    }

    playAudio() {

        this.audio.currentTime = 0;
        this.audio.play();
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y)

        let easeInOutExpo = Easing.easeInOutExpo(this.tint);
        let easeInExpo = Easing.easeInExpo(this.tint);


        ctx.globalCompositeOperation = "source-over";

        let images = this.images[this.state];


        // ctx.globalCompositeOperation = "source-over";
        // ctx.filter = "brightness(0)"
        // ctx.drawImage(images[4], 0, 0, c.width, c.height);


        // console.log(this.multiplier);

        if (this.tint <= 0) {


            ctx.drawImage(images[0], 0, 0, c.width, c.height);

            ctx.restore();
            return;
        }

        let xAvg = 0;
        let yAvg = 0;


        for (let i = 0; i < 3; i++) {

            ctx.globalCompositeOperation = i == 0 ? "source-over" : "lighten"

            let offsetX = ((Math.random() * 2) - 1) * 3 * this.multiplier * easeInExpo;
            let offsetY = ((Math.random() * 2) - 1) * 3 * this.multiplier * easeInExpo;

            xAvg += offsetX;
            yAvg += offsetY;

            ctx.drawImage(images[1 + i], offsetX, offsetY, c.width, c.height);
        }


        xAvg /= 3;
        yAvg /= 3;

        ctx.globalAlpha = easeInOutExpo / 2;
        ctx.globalCompositeOperation = "multiply"
        ctx.filter = "hue-rotate(25deg) saturate(90%) brightness(1.5)"
        ctx.drawImage(images[3], xAvg, yAvg, c.width, c.height);

        ctx.restore();

        // ctx.globalCompositeOperation = "source-over";

        // ctx.fillStyle = `rgba(115, 77, 219, ${easeInOutExpo})`
        // ctx.fillRect(0,0,c.width,c.height)

    }

    update(dt) {

        let speed = 0.25;

        if (this.startEffect) {
            this.multiplier += dt;
            this.tint += dt * speed;
        } else {
            this.multiplier -= dt * 2;
            this.tint -= dt * speed * 4;
        }


        this.multiplier = clamp(this.multiplier, 0, 5);
        // console.log(this.multiplier)
        this.tint = clamp(this.tint, 0, 1);
    }

}