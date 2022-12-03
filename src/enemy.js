const Util = require("./util");

class Enemy {

    constructor(pos) {
        this.health = 10;
        this.attackSpeed = 50;
        this.damage = 5;
        this.speed = 20;
        this.pos = pos;
    }

    // draw(ctx) {
    //     ctx.beginPath();
    //     ctx.arc(this.pos[0],this.pos[1],10,0,2*Math.PI, true); //placeholder, makes a green circle
    //     ctx.fillStyle = "green";
    //     ctx.fill();
    // }

    move() {
        //console.log(`before ${this.pos[0]}`)
        this.pos[0] = Math.max(100,this.pos[0]-this.speed); //this.pos[0] -= this.speed;// minus because we are going right to left
        //console.log(`after ${this.pos[0]}`);
    }

    attack(target) {
        let damage = Util.getRandomInt(this.damage-5,this.damage+1);
        target.health -= damage;
        return damage;
    }
}

module.exports = Enemy;