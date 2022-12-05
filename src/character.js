const Util = require("./util");
const HealthBar = require("./healthbar");

class Character {

    constructor(health,attackSpeed,damage,pos) {
        this.health = health;
        this.attackSpeed = attackSpeed;//change to hit chance
        this.attackTimer = 0;
        this.damage = damage;
        //armor
        //lifesteal
        this.pos = pos;

        this.healthBar = new HealthBar(this.health,this.pos);
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

    canAttack() {
        this.attackTimer++;
        if (this.attackTimer === this.attackSpeed) {
            this.attackTimer = 0;
            return true;
        }
        return false;
    }

}

module.exports = Character;