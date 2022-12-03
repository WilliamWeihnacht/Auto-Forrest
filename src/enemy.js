const Character = require("./character");

class Enemy extends Character {

    constructor(health,attackSpeed,damage,pos,moveSpeed) {
        super(health,attackSpeed,damage,pos);
        this.moveSpeed = moveSpeed;
    }

    move() {
        this.pos[0] = Math.max(100,this.pos[0]-this.moveSpeed); //ensure it cant pass divider (100)
    }
}

module.exports = Enemy;