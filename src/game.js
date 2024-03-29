const Player = require("./player.js");
const Rat = require("./rat.js");
const ItemManager = require("./item_manager.js");
const Satyr = require("./satyr.js");
const RedOgre = require("./red_ogre.js");
const Werewolf = require("./werewolf.js");
const Util = require("./util.js");
const Golem = require("./golem.js");

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
        this.fbSpawned = false;

        //load background imgs
        this.bg1 = new Image();
        this.bg2 = new Image();
        this.bg3 = new Image();
        this.bg4 = new Image();
        this.bg1.src = "./images/background/DarkForest/DarkForest_Background.png";
        this.bg2.src = "./images/background/DarkForest/DarkForest_Middleground.png";
        // this.bg3.src = "./images/background/DarkForest/DarkForest_Shadow.png";
        this.bg4.src = "./images/background/DarkForest/DarkForest_Foreground.png";
        this.spawnTimer = SPAWN_DELAY;

        //allows pause/speed up from within game class
        this.gameView = gameView;

        //the code below is necessary for removing/adding event listeners in the levelUp function
        function itemChosen(item) {
            item.applyStats(this.player);
            document.getElementById("overlay").style.display = "none";
            this.gameView.play();
        }

        this.threeItems = this.itemManager.get3RandomItems();

        this.event1 = (e)=>{itemChosen.bind(this)(this.threeItems[0])}
        this.event2 = (e)=>{itemChosen.bind(this)(this.threeItems[1])}
        this.event3 = (e)=>{itemChosen.bind(this)(this.threeItems[2])}
    }

    //animate a frame of the game
    draw(ctx) {
        ctx.clearRect(0,0,DIM_X,DIM_Y);

        //draw background
        ctx.drawImage(this.bg1,0,0,DIM_X,DIM_Y);
        ctx.drawImage(this.bg2,0,0,DIM_X,DIM_Y);
        // ctx.drawImage(this.bg3,0,0,DIM_X,DIM_Y);
        ctx.drawImage(this.bg4,0,0,DIM_X,DIM_Y);

        //draw player
        this.player.healthBar.draw([this.player.pos[0]+25,this.player.pos[1]+30]);
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
        this.updateStatDisplay();
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

        //spawn final boss
        if (this.player.level === 10) {
            if (!this.fbSpawned) {
                let fb = new Golem();
                this.enemies.push(fb);
                this.fbSpawned = true;
            }

            if (this.enemies.length === 0) this.youWin();

            return;
        }

        //enemy type is random but depends on player level
        let enemy;
        let min = Math.max(this.player.level-3,0);
        let max = this.player.level;
        let randomNum = Util.getRandomInt(min,max);
        switch(randomNum) {
            case 0:
                enemy = new Rat();
                break;
            case 1:
            case 2:
            case 3:
                enemy = new Satyr();
                break;
            case 4:
            case 5:
            case 6:
                enemy = new RedOgre();
                break;

            case 7:
            case 8:
            case 9:
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
            // if (this.player.attackHits()) console.log(`${this.player.name} deals ${this.player.attack(this.enemies[0])} damage!`);
            if (this.player.attackHits()) this.player.attack(this.enemies[0]);

            //enemy attacks
            // if (this.enemies[0].attackHits()) console.log(`${this.enemies[0].name} deals ${this.enemies[0].attack(this.player)} damage!`);
            if (this.enemies[0].attackHits()) this.enemies[0].attack(this.player);

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
        document.getElementById("overlay-options").style.display = "none";
        document.getElementById("overlay-end").style.display = "block";
        document.getElementById("overlay").style.display = "block";       
    }

    youWin() {
        this.gameView.pause();
        document.getElementById("overlay-options").style.display = "none";
        document.getElementById("overlay-win").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    }

    levelUp() {
        // console.log(`${this.player.name} leveled up!`);
        this.player.level++;
        this.player.xp = 0;

        //give player full health on level up
        //this.player.currHealth = this.player.maxHealth;
        //this.player.healthBar.setHealth(this.player.maxHealth);

        this.gameView.pause();
        
        this.threeItems = this.itemManager.get3RandomItems();

        //display item images
        document.getElementById("item1-pic").src = this.threeItems[0].img;
        document.getElementById("item2-pic").src = this.threeItems[1].img;
        document.getElementById("item3-pic").src = this.threeItems[2].img;

        //change button names
        const button1 = document.getElementById("item1-button");
        button1.innerHTML = this.threeItems[0].name;
        const button2 = document.getElementById("item2-button");
        button2.innerHTML = this.threeItems[1].name;
        const button3 = document.getElementById("item3-button");
        button3.innerHTML = this.threeItems[2].name;

        //show the items overlay
        const overlay = document.getElementById("overlay");
        overlay.style.display = "block";
        
        //give each button a fresh event listener
        button1.removeEventListener("click",this.event1);
        button1.addEventListener("click",this.event1);
        
        button2.removeEventListener("click",this.event2);
        button2.addEventListener("click",this.event2);

        button3.removeEventListener("click",this.event3);
        button3.addEventListener("click",this.event3);
    }

    updateStatDisplay() {
        // document.getElementById("player-name").innerHTML = `Name: ${this.player.name}`;
        document.getElementById("player-level").innerHTML = `Level: ${this.player.level}`;
        document.getElementById("player-xp").innerHTML = `XP: ${this.player.xp}/100`;
        document.getElementById("player-health").innerHTML = `Health: ${this.player.currHealth}/${this.player.maxHealth}`;
        document.getElementById("player-hitchance").innerHTML = `Hit Chance: ${this.player.hitChance}`;
        document.getElementById("player-damage").innerHTML = `Damage: ${this.player.damage}`;
        document.getElementById("player-armor").innerHTML = `Armor: ${this.player.armor}`;
        document.getElementById("player-lifesteal").innerHTML = `Life Steal: ${this.player.lifeSteal}`;
    }

}

module.exports = Game;