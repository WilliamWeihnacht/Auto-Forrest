const Player = require("./player.js");
const Enemy = require("./enemy.js");
const Rat = require("./rat.js");
const HealthBar = require("./healthbar");
const ItemManager = require("./item_manager.js");

const DIM_X = 700; //canvas width
const DIM_Y = 400; //canvas height
const DIV = 100; //X value that enemies cannot cross;
const BUFFER = 50; //space between enemies
const SPAWN_DELAY = 20; //ammount of time it takes an enemy to spawn

class Game {

    constructor(gameView) {
        this.player = new Player();
        this.enemies = [];
        this.itemManager = new ItemManager();

        //load background imgs
        this.bg1 = new Image();
        this.bg2 = new Image();
        this.bg3 = new Image();
        this.bg4 = new Image();
        this.bg1.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_Background.png";
        this.bg2.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_Middleground.png";
        this.bg3.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_shadow.png";
        this.bg4.src = "/Users/wwhynot/Documents/AA homework/JS-Project/assets/background/DarkForest/DarkForest_Foreground.png";
        this.spawnTimer = SPAWN_DELAY;

        //allows pause/speed up from within game class
        this.gameView = gameView;
    }

    //animate a frame of the game
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
            this.enemies[i].draw(this.enemies,i,this.player);
        }
    }

    //step the game logic by one frame
    step() {
        this.spawnAnEnemy();
        this.moveEnemies();
        this.resolveAttacks();
        if (this.player.xp >= 100) this.levelUp();
    }

    //move enemys forward if possible and keep them from being on top of each other
    moveEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {

            //the front enemy can only move if they haven't reached the divider
            if (i === 0 && !this.canFight()) {
                    this.enemies[0].move();

            //subsequent enemys must stay BUFFER distance away from the next enemy
            } else if (i !== 0 && this.enemies[i].pos[0] - this.enemies[i].moveSpeed > this.enemies[i-1].pos[0] + BUFFER) {
                this.enemies[i].move();
            }
        }
    }

    //create a new enemy every SPAWN_DELAY frames
    spawnAnEnemy() {
        if (this.spawnTimer < 1) {
            let enemy = new Rat([650,330]);
            this.enemies.push(enemy);
            this.spawnTimer = SPAWN_DELAY;
        } else {
            this.spawnTimer--;
        }
    }

    //
    resolveAttacks() {
        //combat only starts if an enemy is next to the player, ie at the divider
        if (this.canFight()) {

            //player attacks
            if (this.player.canAttack()) console.log(`Player deals ${this.player.attack(this.enemies[0])} damage!`);

            //enemy attacks
            if (this.enemies[0].canAttack()) console.log(`Enemy deals ${this.enemies[0].attack(this.player)} damage!`);

            //kill player if their health goes sub 0
            //enemy health handled in their draw method
            if (this.player.health <= 0) {
                this.gameOver();
            }
        }
    }

    //helper method to tell if enemies are in swinging distance
    canFight() {
        return this.enemies[0] && this.enemies[0].pos[0] <= DIV;
    }

    gameOver() {
        //alert("game over");
    }

    levelUp() {
        console.log("Player leveled up!");
        this.player.level++;
        this.player.xp = 0;

        this.gameView.pause();

        const overlay = document.getElementById("overlay");
        
        let items = this.itemManager.get3RandomItems();

        document.getElementById("item1-pic").src = items[0].img;
        document.getElementById("item2-pic").src = items[1].img;
        document.getElementById("item3-pic").src = items[2].img;

        document.getElementById("item1-button").innerHTML = items[0].name;
        document.getElementById("item2-button").innerHTML = items[1].name;
        document.getElementById("item3-button").innerHTML = items[2].name;

        overlay.style.display = "block";

        function itemChosen(item) {
            item.applyStats(this.player);
            overlay.style.display = "none";
            this.gameView.play(); //figure out why the 2nd level up causes the game to say paused
        }

        const button1 = document.getElementById("item1-button");
        button1.addEventListener("click",()=>{
            itemChosen.bind(this)(items[0]);
        });

        const button2 = document.getElementById("item2-button");
        button2.addEventListener("click",()=>{
            itemChosen.bind(this)(items[1]);
        });

        const button3 = document.getElementById("item3-button");
        button3.addEventListener("click",()=>{
            itemChosen.bind(this)(items[2]);
        });
    }

}

module.exports = Game;