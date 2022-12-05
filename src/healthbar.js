class HealthBar {

    constructor(health,pos) {
        this.maxHealth = health;
        this.curHealth = health;
        this.pos = pos;
    }

    draw(pos) {
        this.pos = pos;
        if (this.curHealth !== this.maxHealth) {
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.fillRect(this.pos[0],this.pos[1],50,10);
            ctx.fillStyle = "green";
            let hbarWidth = Math.max((this.curHealth/this.maxHealth),0);
            ctx.fillRect(this.pos[0],this.pos[1],50*hbarWidth,10);
        }
    }

    subtractHealth(health) {
        this.curHealth -= health;
    }

    setHealth(health) {
        this.curHealth = health;
    }

    
}

module.exports = HealthBar;