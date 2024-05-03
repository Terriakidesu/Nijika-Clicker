let c, ctx;
let clicked = 0;


let floatingTexts = [];
let doritos = [];
let doritoIndex = 0;
let doritoCount = 20 * 15;
let doritoChunks = 20;

let audio;
let mousedisp;
let background;
let nijika;
let NijikaTint = 0;



window.onload = function () {

    setup();

};



function setup() {
    c = document.querySelector("#canvas");
    c.width = 1920;
    c.height = 1080;
    ctx = c.getContext("2d");

    lastUpdate = performance.now();

    Preloader.loadAssets();
    
    Preloader.onLoad = function () {
        
        nijika = new Nijika();
        background = new Background();
        mousedisp = new MouseDisplay();

        Preloader.drawBehind = true;
    };

    Preloader.onExit = function () {

        handleEvents();


        for (let i = 0; i < doritoCount; i++) {
            doritos.push(new Dorito());
        }

    

        window.requestAnimationFrame(update);
    };
}


function draw() {

    background.draw(ctx);
    mousedisp.draw(ctx);

    let fontSize = c.width * 0.02;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(`Clicked: ${clicked}`, 0, fontSize);

    nijika.draw(ctx);

}

function update() {

    updateDeltatime();

    let dt = deltatime;

    // console.log(dt);

    let fontSize = c.width * 0.02;

    draw();

    background.update(dt);
    nijika.update(dt);

    let activeDoritos = doritos.filter((elem, idx) => elem.alive);

    // console.log(activeDoritos)

    for (let dorito of activeDoritos) {
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


    window.requestAnimationFrame(update);

    
}

function handleEvents() {
    let timeout;

    document.addEventListener("contextmenu", ev => {
        ev.preventDefault();
    });

    document.addEventListener("touchstart", ev => {
        ev.preventDefault();

        timeout = handleInputStartEvent(ev);


    }, { capture: true, passive: false });

    document.addEventListener("touchend", () => {
        handleInputStopEvent(timeout);
    });

    document.addEventListener("mousedown", ev => {
        if (ev.buttons !== 1) return;


        timeout = handleInputStartEvent(ev);
    });

    document.addEventListener("mouseup", () => {
        handleInputStopEvent(timeout);
    });

}

function handleInputStartEvent(ev) {


    let x = ev.clientX - c.offsetLeft;
    let y = ev.clientY - c.offsetTop;

    if (ev instanceof TouchEvent) {
        let touch = ev.touches[0];

        x = touch.clientX - c.offsetLeft;
        y = touch.clientY - c.offsetTop;

    }

    x /= c.clientWidth;
    y /= c.clientHeight;

    x *= c.width;
    y *= c.height;

    x = clamp(x, 0, c.width);
    y = clamp(y, 0, c.height);

    let floatingText = new FloatingText(x, y);

    floatingTexts.push(floatingText);


    for (let i = 0; i < doritoChunks; i++) {
        let forceAngle = map(Math.random(), 0, 1, (5 * Math.PI) / 4, (7 * Math.PI) / 4);

        let angle = Math.random() * 2 * Math.PI;

        let doritoSize = clamp(Math.random() * (c.width * 0.03), c.width * 0.01, c.width * 0.03);

        let idx = i + (doritoChunks * (doritoIndex % (doritoCount / doritoChunks)));

        let dorito = doritos[idx];
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

    nijika.playAudio();


    let timeout = setTimeout(function () {
        nijika.start();
    }, 500);

    nijika.setState(1);
    mousedisp.setState(1);

    return timeout;
}

function handleInputStopEvent(timeout) {
    nijika.setState(0);
    mousedisp.setState(0);
    nijika.stop();

    clearTimeout(timeout);
}