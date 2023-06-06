
let audio;
let index = 0;
let mouseIndex = 0;
let deltaTime = 0;
let c, ctx;
let clicked = 0;


let floatingTexts = [];
let doritos = [];
let doritoIndex = 0;
let doritoCount = 20 * 15;
let doritoChunks = 20;


let mousedisp;
let background;
let nijika;
let NijikaTint = 0;

let lastUpdate;
let dt = 0;

window.onload = function () {


    setup()

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


        timeout = setTimeout(function () {
            // interval = setInterval(function () {
                
            //     nijika.multiplier += dt * 4;
            //     nijika.tint += dt * nijika.multiplier;

            // }, 50)
            nijika.start();
        }, 500);

        nijika.setState(1);
        mousedisp.setState(1);

    }

    window.onmouseup = function () {
        nijika.setState(0);
        mousedisp.setState(0);
        nijika.stop();


        clearTimeout(timeout);
        clearInterval(interval);
        
        // nijika.tint = 0;
        // nijika.multiplier = 0;
    }
}


// resize the canvas while maintaining the aspect ratio of 16:9
function resizeCanvas() {

    let aspect_ratio = nijika.size.width / nijika.size.height;


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

    lastUpdate = performance.now();

    audio = new Audio();
    audio.src = "assets/pop-39222.wav";

    nijika = new Nijika();
    background = new Background();
    mousedisp = new MouseDisplay();

    resizeCanvas();

    let doritoImage = new Image()
    doritoImage.src = "assets/Dorito_2.png";

    for (let i = 0; i < doritoCount; i++) {
        doritos.push(new Dorito(doritoImage));
    }


    window.requestAnimationFrame(update);

}

function update() {

    background.draw(ctx);
    background.update(dt);

    mousedisp.draw(ctx);

    let fontSize = c.width * 0.02;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(`Clicked: ${clicked}`, 0, fontSize);

    nijika.draw(ctx);
    nijika.update(dt);

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
    dt = (now - lastUpdate) / 1000;

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
