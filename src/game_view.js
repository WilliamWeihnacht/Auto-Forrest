const Game = require("./game.js");

class GameView {
    constructor(ctx) {
        this.ctx = ctx;
        this.game = new Game();
    }

    start() {
        setInterval(()=>{
            this.game.step();
            this.game.draw(ctx);
        }, 20);
    }

}

module.exports = GameView;