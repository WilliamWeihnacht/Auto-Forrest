const Player = require("./player.js");
const Enemy = require("./enemy.js");
const Rat = require("./rat.js");
const HealthBar = require("./healthbar");

const DIM_X = 700; //canvas width
const DIM_Y = 400; //canvas height
const DIV = 100; //X value that enemies cannot cross;
const BUFFER = 50; //space between enemies
const SPAWN_TIMER = 20; //ammount of frames it takes an enemy to spawn

class Game {

    constructor() {
        this.player = new Player();
        this.enemies = [];
        this.bg1 = new Image();
        this.bg2 = new Image();
        this.bg3 = new Image();
        this.bg4 = new Image();
        this.bg1.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_Background.png";
        this.bg2.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_Middleground.png";
        this.bg3.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_shadow.png";
        this.bg4.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_Foreground.png";
        this.spawnTimer = SPAWN_TIMER;
    }

    draw(ctx) {
        ctx.clearRect(0,0,DIM_X,DIM_Y);

        //draw background
        ctx.drawImage(this.bg1,0,0,DIM_X,DIM_Y);
        ctx.drawImage(this.bg2,0,0,DIM_X,DIM_Y);
        ctx.drawImage(this.bg3,0,0,DIM_X,DIM_Y);
        ctx.drawImage(this.bg4,0,0,DIM_X,DIM_Y);

        //draw player
        this.player.healthBar.draw(this.player.pos);
        if (this.canFight()) {
            this.player.animateAttack();
        } else {
            this.player.animateIdle();
        }
        
        //draw enemies
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw(this.enemies,i);
        }
    }

    step() {
        this.spawnAnEnemy();
        this.moveEnemies();
        this.resolveAttacks();
    }

    moveEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            //make sure the front enemy can't pass the divider
            if (i === 0) {
                if (!this.canFight()) {
                    this.enemies[0].move();
                }
            //make sure they can't pass enemies in front of them
            } else if (this.enemies[i].pos[0] - this.enemies[i].moveSpeed > this.enemies[i-1].pos[0] + BUFFER) {
                this.enemies[i].move();
            }
        }
    }

    spawnAnEnemy() {
        if (this.spawnTimer < 1) {
            let enemy = new Rat([650,330]);
            this.enemies.push(enemy);
            this.spawnTimer = SPAWN_TIMER;
        } else {
            this.spawnTimer--;
        }
    }

    resolveAttacks() {
        //combat only starts if an enemy is next to the player, ie at the divider
        if (this.canFight()) {

            //player attacks
            if (this.player.canAttack()) console.log(`Player deals ${this.player.attack(this.enemies[0])} damage!`);

            //enemy attacks
            if (this.enemies[0].canAttack()) console.log(`Enemy deals ${this.enemies[0].attack(this.player)} damage!`);
            
            //kill enemy or player if their health goes sub 0
            //enemy health handled in their draw method
            if (this.player.health <= 0) {
                this.gameOver();
            }
        }
    }

    //helper method to tell if enemies are in swining distance
    canFight() {
        return this.enemies[0] && this.enemies[0].pos[0] <= DIV;
    }

    gameOver() {
        //alert("game over");
    }

}

module.exports = Game;