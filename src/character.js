const Util = require("./util");
const HealthBar = require("./healthbar");

class Character {

    constructor(maxHealth,hitChance,damage,armor,pos,name) {
        this.maxHealth = maxHealth;
        this.currHealth = maxHealth;
        this.hitChance = hitChance;
        this.damage = damage;
        this.armor = armor;
        this.lifeSteal = 0;
        this.pos = pos;
        this.name = name;
        this.healthBar = new HealthBar(this.maxHealth,this.pos);
    }

    attack(target) {
        //let damage = this.damage + Util.getRandomInt(this.damage-5,this.damage+1);
        //let damage = Math.floor(this.damage * 1.5) - target.armor;
        let damage = Math.max(this.damage - target.armor,1);
        target.takeDamage(damage);
        this.heal(Math.ceil(this.lifeSteal * damage));
        return damage;
    }

    heal(hp) {
        if (this.currHealth + hp > this.maxHealth) {
            this.currHealth = this.maxHealth;
            this.healthBar.setHealth(this.maxHealth)
        } else {   
            this.currHealth += hp;
            this.healthBar.addHealth(hp);
        }
        if (hp > 0) console.log(`${this.name} heals for ${hp}.`);
    }

    takeDamage(dmg) {
        this.currHealth -= dmg;
        this.healthBar.subtractHealth(dmg);
    }

    attackHits() {
        if (Math.random() < this.hitChance) {
            return true;
        } else {
            console.log(`${this.name} misses!`);
            return false;
        }
    }
}

module.exports = Character;