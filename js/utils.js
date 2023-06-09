let lastUpdate;
let deltatime = 0;

function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

function map(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


function updateDeltatime() {
    let now = performance.now();
    deltatime = (now - lastUpdate) / 1000;

    lastUpdate = now;
}