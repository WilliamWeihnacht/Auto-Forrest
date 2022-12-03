const HealthBar = require("./healthbar");
const Util = require("./util");

const WIDTH = 90;
const HEIGHT = 80;

class Player {

    constructor() {
        this.health = 100;
        this.attackSpeed = 5;
        this.attackTimer = 0;
        this.damage = 5;
        //armor
        //lifesteal
        this.pos = [20,290];

        this.healthBar = new HealthBar(this.health,this.pos);

        this.sprite = new Image();
        this.sprite.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/player/Animated Pixel Knight/knight-sprite-sheet.png";

        this.attackLoop = [0,1,2,3,4];
        this.attackIndex = 0;
        
        this.idleLoop = [1,2,3,4];
        this.idleIndex = 0;
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

    canAttack() {
        this.attackTimer++;
        if (this.attackTimer === this.attackSpeed) {
            this.attackTimer = 0;
            return true;
        }
        return false;
    }

    attack(target) {
        let damage = this.damage + Util.getRandomInt(this.damage-5,this.damage+1);
        target.takeDamage(damage);
        return damage;
    }

    takeDamage(dmg) {
        this.health -= dmg;
        this.healthBar.subtractHealth(dmg);
    }
}

module.exports = Player;