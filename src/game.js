const Player = require("./player.js");
const Enemy = require("./enemy.js");

const DIM_X = 700;
const DIM_Y = 400;
const DIV = 100;//X value that enemies cannot cross;
const BUFFER = 30; //space between enemies

class Game {

    constructor() {
        this.player = new Player();
        this.enemies = [];
        this.spawnAnEnemy();
        this.spawnAnEnemy();
        this.spawnAnEnemy();
    }

    draw(ctx) {
        ctx.clearRect(0,0,DIM_X,DIM_Y);
        this.player.draw(ctx);
        this.enemies.forEach((e)=>{
            e.draw(ctx);
        });
    }

    step() {
        this.moveEnemies();
        //resolve attacks
    }

    moveEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            //make sure the front enemy can't pass the divider
            if (i === 0) {
                if (this.enemies[0].pos[0] - this.enemies[0].speed >= DIV) {
                    this.enemies[0].move();
                } else {
                    this.enemies[0].pos[0] = DIV;
                }
            //make sure they can't pass enemies in front of them
            } else if (this.enemies[i].pos[0] - this.enemies[i].speed > this.enemies[i-1].pos[0] + BUFFER) {
                this.enemies[i].move();
            }
        }
    }

    spawnAnEnemy() {
        let xPos;
        if (this.enemies.length === 0) {
            xPos = DIM_X;
        } else {
            xPos = this.enemies[this.enemies.length-1].pos[0] + 20;//spawn the enemy 20px behind the last one
        }
        let enemy = new Enemy([xPos,300]);
        this.enemies.push(enemy);
    }

}

module.exports = Game;