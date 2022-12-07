const Enemy = require("./enemy");

const WIDTH = 42;
const HEIGHT = 22;
const BUFFER = 60; //space between enemies

class Rat extends Enemy {

    constructor() {
        //health: 10, hitChance: .5, damage: 3, armor: 0, pos: [650,330], name: Rat, moveSpeed: 10, xpGranted: 10
        super(10,.5,3,0,[650,350],"Rat",10,10);

        this.sprite = new Image();
        this.sprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/enemy/Monster Pack 2.4/Rat/rat-Sheet.png";

        this.walkLoop = [0,1,2,3];
        this.walkIndex = 0;

        this.attackLoop = [0,1,2,3];
        this.attackIndex = 0;

        this.dieLoop = [0,1,2,3];
        this.dieIndex = 0;

        this.idleLoop = [0,1,2,3];
        this.idleIndex = 0;
    }

    draw(enemies,i,player) {
        this.healthBar.draw(this.pos);
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

    walk() {
        ctx.drawImage(this.sprite,WIDTH * this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);
        this.walkIndex++;
        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;
    }

    animateAttack() {
        ctx.drawImage(this.sprite,WIDTH * this.attackLoop[this.attackIndex], HEIGHT * 2, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);
        this.attackIndex++;
        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;
    }

    idle() {
        ctx.drawImage(this.sprite,WIDTH * this.idleLoop[this.idleIndex], HEIGHT * 4, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);
        this.idleIndex++;
        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;
    }

    die(enemies,player) {
        ctx.drawImage(this.sprite,WIDTH * this.dieLoop[this.dieIndex], HEIGHT * 5, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);
        this.dieIndex++;
        if (this.dieIndex >= this.dieLoop.length) {

            //remove the rat from enemies once it's death animation ends
            //this.dieIndex = 0;
            console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);
            this.grantXP(player);
            enemies.shift();
        }
    }

}

module.exports = Rat;