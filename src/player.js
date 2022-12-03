const Util = require("./util");

const S_DIM = 86; //attackSprite dimensions (square)

class Player {

    constructor() {
        this.health = 100;
        this.attackSpeed = 25;
        this.damage = 5;
        //armor
        //lifesteal
        this.pos = [20,290];

        this.attackSprite = new Image();
        this.attackSprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/player/Knight_1/Attack 1.png"
        this.attackLoop = [0,1,2,3];
        this.attackIndex = 0;
        
        this.idleSprite = new Image();
        this.idleSprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/player/Knight_1/Idle.png";
        this.idleLoop = [0,1,2,3,4];
        this.idleIndex = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.drawImage(this.attackSprite,0,0,S_DIM,S_DIM,this.pos[0],this.pos[1],S_DIM,S_DIM);
        //ctx.drawImage(this.attackSprite,S_DIM,0,S_DIM,S_DIM,this.pos[0],this.pos[1],S_DIM,S_DIM);
    }

    animateAttack() {
        ctx.drawImage(this.attackSprite,S_DIM*this.attackLoop[this.attackIndex],0,S_DIM,S_DIM,this.pos[0],this.pos[1],S_DIM,S_DIM);
        this.attackIndex++;
        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;
    }

    animateIdle() {
        ctx.drawImage(this.idleSprite,S_DIM*this.idleLoop[this.idleIndex],0,S_DIM,S_DIM,this.pos[0],this.pos[1],S_DIM,S_DIM);
        // this.idleIndex++;
        // if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;
    }

    attack(target) {
        let damage = Util.getRandomInt(this.damage-5,this.damage+1);
        target.health -= damage;
        return damage;
    }

}

module.exports = Player;