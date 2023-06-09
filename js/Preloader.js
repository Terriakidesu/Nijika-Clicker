

class Preloader { };

Preloader.drawBehind = false;
Preloader.state = false;
Preloader.exited = false;
Preloader.alreadyLoaded = false;
Preloader.isAllAssestsLoaded = {};
Preloader.t = 0;
Preloader.y = 0;
Preloader.h = 0;
Preloader.doritoImage = new Image();
Preloader.doritoImage.src = "assets/Images/Dorito.png";
Preloader.doritoPos = { x: 0, y: 0 };
Preloader.onLoad = function () { };
Preloader.onExit = function () { };


Preloader.assetList = {
    images: [
        "assets/Images/Background/dorito_bg_2.png",
        "assets/Images/Background/dorito_bg_1.png",
        "assets/Images/Nijika/Nijika_1.png",
        "assets/Images/Nijika/Nijika_2_g.png",
        "assets/Images/Nijika/Nijika_1_r.png",
        "assets/Images/Nijika/Nijika_2_gray.png",
        "assets/Images/Nijika/Nijika_2.png",
        "assets/Images/Nijika/Nijika_1_g.png",
        "assets/Images/Nijika/Nijika_1_b.png",
        "assets/Images/Nijika/Nijika_1_gray.png",
        "assets/Images/Nijika/Nijika_2_b.png",
        "assets/Images/Nijika/Nijika_2_r.png",
        "assets/Images/Mouse/mouse_black_1.png",
        "assets/Images/Mouse/mouse_black_2.png",
        "assets/Images/Dorito.png"
    ],
    audios: [
        "assets/Audio/pop-39222.wav"
    ]
};

Preloader.loadImages = function () {

    let isLoaded = new Array(this.assetList.images.length);
    isLoaded.fill(false);

    this.assetList.images.forEach((im, index) => {
        let img = new Image();
        img.src = im;

        img.addEventListener("load", () => {
            isLoaded[index] = true;

            console.debug(`[Image] "${im}" loaded`);

            if (isLoaded.every((v, _) => v)) {
                Preloader.isAllAssestsLoaded["images"] = true;
            }

        }, { once: true });
    });
}

Preloader.loadAudios = function () {

    let isLoaded = new Array(this.assetList.audios.length);
    isLoaded.fill(false);

    this.assetList.audios.forEach((aud, index) => {
        let audio = new Audio();
        audio.src = aud;

        audio.addEventListener("canplaythrough", () => {
            isLoaded[index] = true;

            console.debug(`[Audio] "${aud}" loaded`);

            if (isLoaded.every((v, _) => v)) {
                Preloader.isAllAssestsLoaded["audios"] = true;
            }

        }, { once: true });
    });
}

Preloader.loadAssets = function () {

    for (let key in this.assetList) {
        Preloader.isAllAssestsLoaded[key] = false;
    }


    this.startAnimation();

    this.loadImages();
    this.loadAudios();
}

Preloader.draw = function () {

    Preloader.doritoPos.x = c.width / 2;
    Preloader.y = c.height / 2;
    Preloader.h = c.height;

    let size = Preloader.doritoImage.width * 0.5;

    if (Preloader.state) {
        let scale = Easing.easeInExpo(Preloader.t);
        size = Preloader.doritoImage.width * 0.5 * map(scale, 0, 1, 0.5, 1);

        let easing = Easing.easeInOutBack(Preloader.t);
        Preloader.doritoPos.y = (c.height / 2) * map(easing, 0, 1, -0.2, 1);

    } else {


        let easing = Easing.easeOutBack(Preloader.t);

        let doritoEasing = 1 - easing;
        Preloader.doritoPos.y = map(doritoEasing, 0, 1, c.height / 2, c.height * 1.1);

        let bgEasing = 1 - Easing.easeOutBack(Preloader.t);
        Preloader.y = (c.height) * map(bgEasing, 0, 1, 0.5, 2);

        let heightEasing = Easing.easeInBack(Preloader.t);
        Preloader.h = c.height * map(heightEasing, 0, 1, 0.5, 1);

    }


    if (Preloader.drawBehind) {

        draw();

        background.update(deltatime);
    }

    ctx.save();
    ctx.fillStyle = "rgb(245, 203, 51)";
    ctx.translate(c.width / 2, Preloader.y);
    ctx.fillRect(-c.width / 2, -(Preloader.h / 2), c.width, Preloader.h);
    ctx.restore();

    ctx.save();
    ctx.translate(Preloader.doritoPos.x, Preloader.doritoPos.y);
    ctx.drawImage(Preloader.doritoImage, -size / 2, -size / 2, size, size);
    ctx.restore();

}

Preloader.update = function () {

    let dt = deltatime;
    let allLoaded = Preloader.alreadyLoaded;

    if (!Preloader.exited) Preloader.draw();


    if (Preloader.state) {
        allLoaded = Object.values(Preloader.isAllAssestsLoaded).every((e, _) => e);
        Preloader.t += dt;
    } else {
        Preloader.t -= dt * 0.8;
    }

    Preloader.t = clamp(Preloader.t, 0, 1);

    // console.log(allLoaded)

    if (Preloader.state && Preloader.t >= 1) {

        if (allLoaded && !Preloader.alreadyLoaded) {
            setTimeout(function () {
                Preloader.alreadyLoaded = true;

                Preloader.onLoad();

                setTimeout(function () {
                    Preloader.exitAnimation();
                }, 100);
            }, 10);
        };
    } else if (!Preloader.state) {
        if (Preloader.t <= 0) {
            if (!Preloader.exited) Preloader.onExit();

            Preloader.exited = true;
        }
    }

    updateDeltatime();

    window.requestAnimationFrame(Preloader.update)
}


Preloader.startAnimation = function () {
    Preloader.state = true;

    window.requestAnimationFrame(Preloader.update);
}


Preloader.exitAnimation = function () {

    Preloader.state = false;
}



