if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent))
    alert("This is not designed for mobile, it may look weird and perform badly");

const player = document.getElementById("player");
const upload = document.getElementById("upload");
const url = document.getElementById("url");
const canv = document.getElementById("visualizer");
const ctx = canv.getContext("2d");

const title = document.getElementById("np");
const title2 = document.getElementById("np2");

let audio;
let an;
let src;

function start() {
    if (!audio) {
        audio = new AudioContext();
        an = audio.createAnalyser();
        src = audio.createMediaElementSource(player);
        src.connect(an);
        an.connect(audio.destination);
        an.fftSize = 256;
        viz();
    }
}

function viz() {
    const len = an.frequencyBinCount;
    const data = new Uint8Array(len);
    ctx.clearRect(0, 0, canv.width, canv.height);

    function draw() {
        requestAnimationFrame(draw);
        an.getByteFrequencyData(data);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canv.width, canv.height);

        const bw = (canv.width / len) * 2.5;
        let bh;
        let x = 0;

        for (let i = 0; i < len; i++) {
            bh = data[i];
            ctx.fillStyle = `rgb(${bh + 100}, 255, 255)`;
            ctx.fillRect(x, canv.height - bh / 2, bw, bh / 2);
            x += bw + 1;
        }
    }
    draw();
}

upload.addEventListener("change", function () {
    const file = upload.files[0];
    if (file) {
        player.src = URL.createObjectURL(file);
        title2.innerHTML = `Starting...`;
        player.addEventListener("canplaythrough", function () {
            adj(player);
            player.play();
            document.getElementById("plps").innerHTML = "Pause";
            start();
        }, { once: true });
        console.log(`Loading ${file.name}`);
    }
});

url.addEventListener("change", function () {
    const link = url.value.trim();
    if (link) {
        title2.innerHTML = `Starting...`;
        player.src = link;
        player.addEventListener("canplaythrough", function () {
            adj(player);
            player.play();
            document.getElementById("plps").innerHTML = "Pause";
            start();
        }, { once: true });
        console.log(`Loading ${link}`);
    }
});

function adj(vid) {
    const ar = vid.videoWidth / vid.videoHeight;
    vid.width = ar > 1 ? 650 : 370;
    console.log(`Width: ${vid.width}`);
}

function toggle() {
    player.controls = !player.controls;
}

function loop() {
    player.loop = !player.loop;
    document.getElementById("loop").innerHTML = player.loop ? "Loop ON" : "Loop OFF";
    console.log(`Loop ${player.loop ? "on" : "off"}`);
}

function plps() {
    if (player.paused) {
        player.play();
        document.getElementById("plps").innerHTML = "Pause";
        console.log("Play");
    } else {
        player.pause();
        document.getElementById("plps").innerHTML = "Resume";
        console.log("Pause");
    }
}

player.addEventListener("play", function () {
    title.innerHTML = `▶ player`;
    title2.innerHTML = `Playing`;
    console.log(`Playing`);
});

player.addEventListener("pause", function () {
    title.innerHTML = `player`;
    title2.innerHTML = `Stopped`;
    console.log(`Paused`);
});

player.addEventListener("ended", function () {
    title.innerHTML = "player";
    title2.innerHTML = "Stopped";
    console.log(`End`);
});

player.addEventListener("error", function () {
    title.innerHTML = "player";
    title2.innerHTML = "Failed";
    console.log(`Error`);
});

function stop() {
    player.pause();
    player.currentTime = 0;
    if (audio) {
        audio.close();
        audio = null;
        an = null;
        src = null;
    }
    console.log(`Stop`);
}

function rwd() {
    player.currentTime -= 10;
    console.log(`-10s`);
}

function fwd() {
    player.currentTime += 10;
    console.log(`+10s`);
}

const time = document.getElementById("time");
player.addEventListener("timeupdate", function () {
    time.innerHTML = `${ft(player.currentTime)} / ${ft(player.duration)}`;
    index.max = player.duration;
    index.value = player.currentTime;
    idx.innerHTML = Math.floor(player.currentTime);
});

function ft(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

const speed = document.getElementById("speed");
const spd = document.getElementById("spd");
speed.addEventListener("input", function () {
    player.playbackRate = speed.value;
    spd.innerHTML = speed.value;
    console.log(`Speed: ${speed.value}`);
});

const vol = document.getElementById("volume");
const v = document.getElementById("vol");
vol.addEventListener("input", function () {
    player.volume = vol.value;
    v.innerHTML = vol.value;
    console.log(`Vol: ${vol.value}`);
});

const index = document.getElementById("index");
const idx = document.getElementById("idx");
index.addEventListener("input", function () {
    player.currentTime = index.value;
    console.log(`At: ${index.value}`);
});

console.log("ready");

setInterval( function () {
    document.getElementById("today").innerHTML = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }).toLocaleLowerCase() + ' ' + new Date().toLocaleDateString(); // what a clusterfuck this is
}, 1000)