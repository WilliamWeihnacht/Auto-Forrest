const Player = require("./player.js");
const Enemy = require("./enemy.js");
const Rat = require("./rat.js");
const HealthBar = require("./healthbar");
const ItemManager = require("./item_manager.js");
const Satyr = require("./satyr.js");
const RedOgre = require("./red_ogre.js");
const Werewolf = require("./werewolf.js");
const Util = require("./util.js");

const DIM_X = 700; //canvas width
const DIM_Y = 400; //canvas height
const DIV = 100; //X value that enemies cannot cross;
const BUFFER = 50; //space between enemies
const SPAWN_DELAY = 50; //ammount of calls it takes an enemy to spawn

class Game {

    constructor(gameView) {
        this.player = new Player();
        this.enemies = [];
        this.itemManager = new ItemManager();
        this.combatCounter = 0;

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

        //enemy type depends on player level
        let enemy;
        let randomNum = Util.getRandomInt(0,Math.floor(this.player.level/2));
        switch(randomNum) {
            case 0:
                enemy = new Rat();
                break;
            case 1:
                enemy = new Satyr();
                break;
            case 2:
                enemy = new RedOgre();
                break;
            case 3:
                enemy = new Werewolf();
                break;
            default:
                enemy = new Rat();
        }

        if (this.spawnTimer < 1) {
            this.enemies.push(enemy);
            this.spawnTimer = SPAWN_DELAY;
        } else {
            this.spawnTimer--;
        }
    }

    //
    resolveAttacks() {

        //attacks should only occur every 4 frames to line up with the player's attacck
        this.combatCounter++;
        if (this.combatCounter < 5) return;
        this.combatCounter = 0;

        //combat only starts if an enemy is next to the player, ie at the divider
        if (this.canFight()) {

            //player attacks
            if (this.player.attackHits()) console.log(`${this.player.name} deals ${this.player.attack(this.enemies[0])} damage!`);

            //enemy attacks
            if (this.enemies[0].attackHits()) console.log(`${this.enemies[0].name} deals ${this.enemies[0].attack(this.player)} damage!`);

            //kill player if their health goes sub 0
            //enemy health handled in their draw method
            if (this.player.currHealth <= 0) {
                this.gameOver();
            }
        }
    }

    //helper method to tell if enemies are in swinging distance
    canFight() {
        return this.enemies[0] && this.enemies[0].pos[0] <= DIV;
    }

    gameOver() {
        this.gameView.pause();
        alert("game over");
    }

    levelUp() {
        console.log(`${this.player.name} leveled up!`);
        this.player.level++;
        this.player.xp = 0;

        //give player full health on level up
        //this.player.currHealth = this.player.maxHealth;
        //this.player.healthBar.setHealth(this.player.maxHealth);

        this.gameView.pause();
        
        let threeItems = this.itemManager.get3RandomItems();
        console.log(threeItems);

        //display item images
        document.getElementById("item1-pic").src = threeItems[0].img;
        document.getElementById("item2-pic").src = threeItems[1].img;
        document.getElementById("item3-pic").src = threeItems[2].img;

        //name item buttons appropriately
        const button1 = document.getElementById("item1-button");
        button1.innerHTML = threeItems[0].name;
        button1.addEventListener("click",(e)=>{
            //e.stopImmediatePropagation();
            console.log("B1 CLICKED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log(threeItems[0]);
            console.log(threeItems);
            console.log(this);
            overlay.style.display = "none";
            threeItems[0].applyStats(this.player);
            this.gameView.play();
        });

        const button2 = document.getElementById("item2-button");
        button2.innerHTML = threeItems[1].name;
        button2.addEventListener("click",(e)=>{
            e.stopImmediatePropagation();
            console.log("B2 CLICKED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log(threeItems[1]);
            overlay.style.display = "none";
            threeItems[1].applyStats(this.player);
            this.gameView.play();
        });

        const button3 = document.getElementById("item3-button");
        button3.innerHTML = threeItems[2].name;
        button3.addEventListener("click",(e)=>{
            e.stopImmediatePropagation();
            console.log("B3 CLICKED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log(threeItems[2]);
            overlay.style.display = "none";
            threeItems[2].applyStats(this.player);
            this.gameView.play();
        });

        //show the items overlay
        const overlay = document.getElementById("overlay");
        overlay.style.display = "block";

        // function itemChosen(item) {
        //     item.applyStats(this.player);
        //     overlay.style.display = "none";
        //     this.gameView.play();
        // }

        
        // button1.addEventListener("click",()=>{
        //     itemChosen.bind(this)(items[0]);
        // });

        

        
        

        
    }

}

module.exports = Game;