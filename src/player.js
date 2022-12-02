class Player {

    constructor() {
        this.health = 100;
        this.attackSpeed = 1.0;
        this.damage = 5;
        //armor
        //lifesteal
        this.pos = [20,300];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos[0],this.pos[1],20,0,2*Math.PI, true); //placeholder, makes a yellow circle
        ctx.fillStyle = "yellow";
        ctx.fill();
    }

    attack(target) {

    }

}

module.exports = Player;