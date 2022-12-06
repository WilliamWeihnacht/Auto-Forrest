const Game = require("./game.js");

class GameView {
    constructor(ctx) {
        this.frame = 0;
        this.ctx = ctx;
        this.paused = false;
        this.frameCap = 10;
        this.game = new Game(this);
    }

    step() {
        this.frame++;
        if (this.frame < this.frameCap) {
            window.requestAnimationFrame(this.step.bind(this));
            return;
        }
        this.frame = 0;
        if (!this.paused) this.game.step(this.frame);
        this.game.draw(ctx,this.frame,this.step.bind(this));
        window.requestAnimationFrame(this.step.bind(this));
    }

    pause() {
        this.paused = true;
    }

    play() {
        this.paused = false;
    }

    slideSpeed(speed) {
        this.frameCap = speed;
    }
}

module.exports = GameView;