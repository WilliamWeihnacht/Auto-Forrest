class Enemy {

    constructor(pos) {
        this.health = 10;
        this.attackSpeed = 1.0;
        this.damage = 5;
        this.speed = 3;
        //this.pos = [650,300]; //since canvas is 700x400 they start on the far right 100px up
        this.pos = pos;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos[0],this.pos[1],10,0,2*Math.PI, true); //placeholder, makes a green circle
        ctx.fillStyle = "green";
        ctx.fill();
    }

    move() {//consider making this a game method: moveEnemies
        this.pos[0] -= this.speed;// minus because we are going right to left
    }

    attack() {

    }

}

module.exports = Enemy;