const Game = require("./game.js");

class GameView {
    constructor(ctx) {
        this.frame = 0;
        this.ctx = ctx;
        this.game = new Game();
    }

    start() {//obselete
        setInterval(()=>{
            this.frame++;
            this.game.step();
            this.game.draw(ctx);
        }, 20);
    }

    step() {
        this.frame++;
        if (this.frame < 10) {
            window.requestAnimationFrame(this.step.bind(this));
            return;
        }
        this.frame = 0;
        this.game.step(this.frame);
        this.game.draw(ctx,this.frame,this.step.bind(this));
        window.requestAnimationFrame(this.step.bind(this));
    }
}

module.exports = GameView;