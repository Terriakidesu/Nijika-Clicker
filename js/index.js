
const imageNames = [
    "assets/Nijika_1.png",
    "assets/Nijika_2.png",
    "assets/mouse_black_1.png",
    "assets/mouse_black_2.png",
    "assets/Dorito_2.png",
    "assets/dorito_bg_1.png",
    "assets/dorito_bg_2.png",
]

let images = [];
let preloaded = false;
let audio;
let index = 0;
let mouseIndex = 0;
let deltaTime = 0;
let c, ctx;
let clicked = 0;
let lastUpdate = performance.now();
let floatingTexts = [];
let doritos = [];
let doritoIndex = 0;
let doritoCount = 20 * 15;
let doritoChunks = 20;
let BGIndex = 0;
let bgPos = { x: 0, y: 0 };

let NijikaPos = { x: 0, y: 0 };
let NijikaTint = 0;

window.onload = function () {

    preload();

    window.onresize = function () {
        resizeCanvas();
    };

    let interval, timeout;

    window.oncontextmenu = function (ev) {
        ev.preventDefault();
    }

    window.onmousedown = function (ev) {


        if (ev.buttons !== 1) return;

        let x = ev.clientX - c.offsetLeft;
        let y = ev.clientY - c.offsetTop;

        x = clamp(x, 0, c.width);
        y = clamp(y, 0, c.height);

        let floatingText = new FloatingText(x, y);

        floatingTexts.push(floatingText);


        for (let i = 0; i < doritoChunks; i++) {
            let forceAngle = map(Math.random(), 0, 1, (5 * Math.PI) / 4, (7 * Math.PI) / 4);

            let angle = Math.random() * 2 * Math.PI;

            let doritoSize = clamp(Math.random() * (c.width * 0.03), c.width * 0.01, c.width * 0.03);

            let idx = i + (doritoChunks * (doritoIndex % (doritoCount / doritoChunks)));

            let dorito = doritos[idx]
            dorito.lifetime = 0;
            dorito.alive = true;

            dorito.setRotateReverse(Math.random() >= 0.5);
            dorito.setPosition(x, y);
            dorito.setSize(doritoSize);
            dorito.setAngle(angle);
            dorito.setForceAngle(forceAngle);
            dorito.setScale(1);

        }


        doritoIndex++;
        clicked++;

        audio.pause();
        audio.currentTime = 0;
        audio.play();

        let multiplier = 0;

        timeout = setTimeout(function () {
            interval = setInterval(function () {
                NijikaPos.x = (Math.random() * 2 - 1) * (c.width * 0.002 * multiplier)
                NijikaPos.y = (Math.random() * 2 - 1) * (c.height * 0.002 * multiplier)

                multiplier += dt;
                NijikaTint += dt * multiplier;

                multiplier = clamp(multiplier, 0, 5);
                NijikaTint = clamp(NijikaTint, 0, 1);

            }, 50)
        }, 500);

        mouseIndex = 1;
        index = 1;

    }

    window.onmouseup = function () {
        mouseIndex = 0;
        index = 0;

        clearTimeout(timeout);
        clearInterval(interval);
        NijikaPos.x = 0;
        NijikaPos.y = 0;
        NijikaTint = 0;
    }
}

function preload() {

    let loaded = new Array(imageNames.length);
    loaded.fill(false);

    audio = new Audio();

    audio.src = "assets/pop-39222.wav";
    audio.oncanplaythrough = function () {

        for (let i = 0; i < imageNames.length; i++) {

            let image = new Image();
            image.src = imageNames[i];

            image.onload = function () {
                loaded[i] = true

                if (loaded.every((e) => e)) {
                    if (preloaded) return

                    setup();
                    preloaded = true;
                }
            }

            images.push(image);
        }
    }
}

// resize the canvas while maintaining the aspect ratio of 16:9
function resizeCanvas() {

    let aspect_ratio = images[0].width / images[1].height;


    let canvas_width = Math.floor(window.innerWidth * 1);
    let canvas_height = Math.floor(canvas_width / aspect_ratio);

    if (canvas_height >= window.innerHeight) {
        canvas_height = Math.floor(window.innerHeight * 1);
        canvas_width = Math.floor(canvas_height * aspect_ratio);
    }

    c.width = canvas_width;
    c.height = canvas_height;
}

function setup() {
    c = document.querySelector("#canvas");
    ctx = c.getContext("2d");

    resizeCanvas();

    for (let i = 0; i < doritoCount; i++) {
        doritos.push(new Dorito(images[4]));
    }


    window.requestAnimationFrame(update);

}

function update() {

    dt = deltaTime / 1000

    let easeInOutExpo = Easing.easeInOutExpo(NijikaTint);


    ctx.save();
    
    ctx.fillStyle = "rgb(241,213,81)";

    ctx.fillRect(0, 0, c.width, c.height);
    ctx.restore();


    ctx.save();

    ctx.globalAlpha = 0.6;

    let frame = Math.floor(BGIndex) % 2;

    BGIndex += dt * 2;


    for (let i = 0; i < 4; i++) {

        let x = Math.floor(i / 2);
        let y = i % 2;

        ctx.drawImage(images[5 + frame], bgPos.x - (c.width * x), bgPos.y - (c.height * y), c.width, c.height);
    }

    bgPos.y += c.height * 0.05 * dt;
    bgPos.x += c.width * 0.05 * dt;

    if (bgPos.y >= c.height) {
        bgPos.y = 0;
    }

    if (bgPos.x >= c.width) {
        bgPos.x = 0;
    }

    ctx.restore();

    ctx.save();


    ctx.translate(NijikaPos.x, NijikaPos.y);

    ctx.filter = `hue-rotate(${easeInOutExpo * 300}deg) contrast(${lerp(100, 85, easeInOutExpo)}%) brightness(${lerp(1, 0.85, easeInOutExpo)})`;

    ctx.drawImage(images[index], 0, 0, c.width, c.height);
    ctx.restore();

    let size = Math.floor(c.width * 0.1)
    ctx.drawImage(images[mouseIndex + 2], 0, c.height - size, size, size);

    let fontSize = c.width * 0.02;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(`Clicked: ${clicked}`, 0, fontSize);

    // console.log(doritos[0])

    // doritos[0].draw(ctx);

    for (let dorito of doritos) {
        dorito.draw(ctx);
        dorito.update(dt);
    }


    for (let floatingText of floatingTexts) {

        if (floatingText.lifetime >= floatingText.maxLife) {
            let i = floatingTexts.indexOf(floatingText);
            floatingTexts.splice(i, 1);
        }

        floatingText.draw(ctx, fontSize);
        floatingText.update(dt);
    }

    now = performance.now();
    deltaTime = now - lastUpdate;

    lastUpdate = now;

    window.requestAnimationFrame(update);
}

function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

function map(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
