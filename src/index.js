const GameView = require("./game_view.js");

const canvas = document.getElementById("game-canvas");
canvas.width = 700;
canvas.height = 400;
const ctx = canvas.getContext("2d");
window.ctx = ctx;

const gameView = new GameView(ctx);
gameView.pause();
const overlay = document.getElementById("overlay");
const instructions = document.getElementById("overlay-instructions");
document.getElementById("instructions-button").addEventListener("click",()=>{
    instructions.style.display = "none";
    overlay.style.display = "none";
    document.getElementById("overlay-options").style.display = "flex";
    gameView.play();
});

document.getElementById("restart-button").addEventListener("click",()=>{
    document.getElementById("overlay-end").style.display = "none";
    window.location.reload();
});

document.getElementById("restart-button2").addEventListener("click",()=>{
    document.getElementById("overlay-win").style.display = "none";
    window.location.reload();
});

const slider = document.getElementById("speed-slider")
slider.addEventListener("change",()=>{
    gameView.slideSpeed(slider.value);
});
window.requestAnimationFrame(()=>gameView.step());