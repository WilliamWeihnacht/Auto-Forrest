const Character = require("./character");

const WIDTH = 90;
const HEIGHT = 80;

class Player extends Character {

    constructor(name = "Player") {
        //health: 200, hitChance: .7, damage: 5, armor: 0, pos: [20,290]
        super(200,.7,5,0,[10,270],name);
        this.level = 0;
        this.xp = 0;
        
        this.sprite = new Image();
        this.sprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/player/Animated Pixel Knight/knight-sprite-sheet.png";

        this.attackLoop = [0,1,2,3,4];
        this.attackIndex = 0;
        
        this.idleLoop = [1,2,3,4];
        this.idleIndex = 0;
    }

    animateAttack() {
        ctx.drawImage(this.sprite,WIDTH*this.attackLoop[this.attackIndex],HEIGHT,WIDTH,HEIGHT,this.pos[0],this.pos[1],WIDTH*1.5,HEIGHT*1.5);
        this.attackIndex++;
        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;
    }

    animateIdle() {
        ctx.drawImage(this.sprite,WIDTH*this.idleLoop[this.idleIndex],0,WIDTH,HEIGHT,this.pos[0],this.pos[1],WIDTH*1.5,HEIGHT*1.5);
        this.idleIndex++;
        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;
    }

}

module.exports = Player;