const Util = require("./util");
const HealthBar = require("./healthbar");

class Enemy {

    constructor(pos) {
        this.health = 10;
        this.attackSpeed = 5;
        this.attackTimer = 0;
        this.damage = 5;
        this.speed = 20;
        this.pos = pos;
        this.healthBar = new HealthBar(this.health,[this.pos[0],this.pos[1]-20]);
    }

    move() {
        this.pos[0] = Math.max(100,this.pos[0]-this.speed); //ensure it cant pass divider (100)
    }

    attack(target) {
        let damage = this.damage + Util.getRandomInt(this.damage-5,this.damage+1);
        target.takeDamage(damage);
        return damage;
    }

    canAttack() {
        this.attackTimer++;
        if (this.attackTimer === this.attackSpeed) {
            this.attackTimer = 0;
            return true;
        }
        return false;
    }

    takeDamage(dmg) {
        this.health -= dmg;
        this.healthBar.subtractHealth(dmg);
    }
}

module.exports = Enemy;