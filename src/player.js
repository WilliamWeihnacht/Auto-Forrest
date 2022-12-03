const Util = require("./util");

//const S_DIM = 86; //attackSprite dimensions (square)
const WIDTH = 90;
const HEIGHT = 80;

class Player {

    constructor() {
        this.health = 100;
        this.attackSpeed = 25;
        this.damage = 5;
        //armor
        //lifesteal
        this.pos = [20,290];

        this.sprite = new Image();
        this.sprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/player/Animated Pixel Knight/knight-sprite-sheet.png";

        // this.attackSprite = new Image();
        // this.attackSprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/player/Knight_1/Attack 1.png"
        this.attackLoop = [0,1,2,3,4];
        this.attackIndex = 0;
        
        // this.idleSprite = new Image();
        // this.idleSprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/player/Knight_1/Idle.png";
        this.idleLoop = [1,2,3,4];
        this.idleIndex = 0;
    }

    draw(ctx) {
        
    }

    animateAttack() {
        ctx.drawImage(this.sprite,WIDTH*this.attackLoop[this.attackIndex],HEIGHT,WIDTH,HEIGHT,this.pos[0],this.pos[1],WIDTH,HEIGHT);
        this.attackIndex++;
        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;
    }

    animateIdle() {
        ctx.drawImage(this.sprite,WIDTH*this.idleLoop[this.idleIndex],0,WIDTH,HEIGHT,this.pos[0],this.pos[1],WIDTH,HEIGHT);
        this.idleIndex++;
        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;
    }

    attack(target) {
        let damage = Util.getRandomInt(this.damage-5,this.damage+1);
        target.health -= damage;
        return damage;
    }

}

module.exports = Player;