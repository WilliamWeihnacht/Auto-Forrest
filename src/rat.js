const Enemy = require("./enemy");
const HealthBar = require("./healthbar");

const WIDTH = 42;
const HEIGHT = 22;
const BUFFER = 50; //space between enemies

class Rat extends Enemy {

    constructor(pos) {
        super(pos);

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

    draw(enemies,i) {
        this.healthBar.draw(this.pos);
        if (this.health <= 0) {
            this.die(enemies);
        } else if (i === 0 && this.pos[0] <= 100) {
            this.animateAttack();
        } else if (i > 0 && enemies[i-1].pos[0] > enemies[i].pos[0] + BUFFER) {
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

    die(enemies) {
        ctx.drawImage(this.sprite,WIDTH * this.dieLoop[this.dieIndex], HEIGHT * 5, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);
        this.dieIndex++;
        if (this.dieIndex >= this.dieLoop.length) {
            this.dieIndex = 0;
            console.log(`The rat dies`);
            enemies.shift();
        }
    }

}

module.exports = Rat;