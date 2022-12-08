const Enemy = require("./enemy");

const WIDTH = 74;
const HEIGHT = 57;
const BUFFER = 60;

class Golem extends Enemy {

    constructor() {
        //health: 50, hitChance: 1, damage: 10, armor: 5, pos: [], name: Golem, moveSpeed: 10, xpGranted: 0
        super(50,1,10,5,[650,280],"Golem",10,0);

        this.sprite = new Image();
        this.sprite.src = "./assets/enemy/Monster Pack 2.4/Golem/golem-Sheet.png";

        this.walkLoop = [0,1,2,3,4];
        this.walkIndex = 0;

        this.attackLoop = [0,1,2,3,4,0,1,2,3,4];
        this.attackIndex = 0;

        this.dieLoop = [3,4,5,0,1,2,3,4];
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
        let h = this.dieIndex > 2 ? 6 : 5;
        ctx.drawImage(this.sprite, WIDTH*this.dieLoop[this.dieIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)
        this.dieIndex++
        if (this.dieIndex >= this.dieLoop.length) {
            // this.dieIndex =0
            // console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);
            this.grantXP(player);
            enemies.shift();
        }
    }
}

module.exports = Golem;