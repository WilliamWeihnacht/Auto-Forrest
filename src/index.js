const GameView = require("./game_view.js");

const canvas = document.getElementById("game-canvas");
canvas.width = 700;
canvas.height = 400;
const ctx = canvas.getContext("2d");
window.ctx = ctx;

const gameView = new GameView(ctx);
gameView.start();

