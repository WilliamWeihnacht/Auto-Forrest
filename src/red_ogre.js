const Enemy = require("./enemy");

const WIDTH = 73;
const HEIGHT = 46;
const BUFFER = 60;

class RedOgre extends Enemy {

    constructor() {
        //health: 25, hitChance: .8, damage: 15, armor: 2, pos: [], name: Red Ogre, moveSpeed: 15, xpGranted: 
        super(25,.8,15,2,[650,290],"Red Ogre",10,20);

        this.sprite = new Image();
        this.sprite.src = "./images/enemy/Monster Pack 2.4/Red Ogre/red-ogre-Sheet.png";

        this.walkLoop = [0,1,2,3,4];
        this.walkIndex = 0;

        this.attackLoop = [0,1,2,3,4,0,1,2,3,4];
        this.attackIndex = 0;

        this.dieLoop = [0,1,2,3,4,0,1,2];
        this.dieIndex = 0;

        this.idleLoop = [0,1,2,3];
        this.idleIndex = 0;
    }

    draw(enemies,i,player) {
        this.healthBar.draw([this.pos[0]+50,this.pos[1]-5]);
        if (this.currHealth <= 0) {
            this.die(enemies,player);
        } else if (i === 0 && this.pos[0] <= 100) {
            this.animateAttack();
        } else if ((i === 0 && this.pos[0] > 100) || enemies[i-1].pos[0] < this.pos[0] - BUFFER) {
            this.walk();
        } else {
            this.idle();
        }
    }

    idle() {
        ctx.drawImage(this.sprite, WIDTH*this.idleLoop[this.idleIndex], 0, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);
        this.idleIndex++
        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;
    }

    walk() {
        ctx.drawImage(this.sprite, WIDTH*this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)
        this.walkIndex++
        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;
    }

    animateAttack() {
        let h = this.attackIndex > 4 ? 3 : 2;
        ctx.drawImage(this.sprite, WIDTH*this.attackLoop[this.attackIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)
        this.attackIndex++
        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;
    }

    die(enemies,player) {
        let h = this.dieIndex > 4 ? 5 : 4;
        if (this.dieIndex > 4) h = 5;
        ctx.drawImage(this.sprite, WIDTH*this.dieLoop[this.dieIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)
        this.dieIndex++
        if (this.dieIndex >= this.dieLoop.length) {
            //this.dieIndex = 0;
            // console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);
            this.grantXP(player);
            enemies.shift();
        }
    }
}

module.exports = RedOgre;