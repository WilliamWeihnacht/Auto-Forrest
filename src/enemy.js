const Character = require("./character");

class Enemy extends Character {

    constructor(health,attackSpeed,damage,pos,moveSpeed,xpGranted) {
        super(health,attackSpeed,damage,pos);
        this.moveSpeed = moveSpeed;
        this.xpGranted = xpGranted;
        this.alive = true;
    }

    move() {
        this.pos[0] = Math.max(100,this.pos[0]-this.moveSpeed); //ensure it cant pass divider (100)
    }

    grantXP(player) {
        player.xp += this.xpGranted;
    }
}

module.exports = Enemy;