/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/character.js":
/*!**************************!*\
  !*** ./src/character.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Util = __webpack_require__(/*! ./util */ \"./src/util.js\");\nconst HealthBar = __webpack_require__(/*! ./healthbar */ \"./src/healthbar.js\");\n\nclass Character {\n\n    constructor(maxHealth,hitChance,damage,armor,pos,name) {\n        this.maxHealth = maxHealth;\n        this.currHealth = maxHealth;\n        this.hitChance = hitChance;\n        this.damage = damage;\n        this.armor = armor;\n        this.lifeSteal = 0;\n        this.pos = pos;\n        this.name = name;\n        this.healthBar = new HealthBar(this.maxHealth,this.pos);\n    }\n\n    attack(target) {\n        //let damage = this.damage + Util.getRandomInt(this.damage-5,this.damage+1);\n        //let damage = Math.floor(this.damage * 1.5) - target.armor;\n        let damage = Math.max(this.damage - target.armor,1);\n        target.takeDamage(damage);\n        this.heal(Math.ceil(this.lifeSteal * damage));\n        return damage;\n    }\n\n    heal(hp) {\n        if (this.currHealth + hp > this.maxHealth) {\n            this.currHealth = this.maxHealth;\n            this.healthBar.setHealth(this.maxHealth)\n        } else {   \n            this.currHealth += hp;\n            this.healthBar.addHealth(hp);\n        }\n        //if (hp > 0) console.log(`${this.name} heals for ${hp}.`);\n    }\n\n    takeDamage(dmg) {\n        this.currHealth -= dmg;\n        this.healthBar.subtractHealth(dmg);\n    }\n\n    attackHits() {\n        if (Math.random() < this.hitChance) {\n            return true;\n        } else {\n            // console.log(`${this.name} misses!`);\n            return false;\n        }\n    }\n}\n\nmodule.exports = Character;\n\n//# sourceURL=webpack://js-project/./src/character.js?");

/***/ }),

/***/ "./src/enemy.js":
/*!**********************!*\
  !*** ./src/enemy.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Character = __webpack_require__(/*! ./character */ \"./src/character.js\");\n\nclass Enemy extends Character {\n\n    constructor(maxHealth,hitChance,damage,armor,pos,name,moveSpeed,xpGranted) {\n        super(maxHealth,hitChance,damage,armor,pos,name);\n        this.moveSpeed = moveSpeed;\n        this.xpGranted = xpGranted;\n        this.alive = true;\n    }\n\n    move() {\n        this.pos[0] = Math.max(100,this.pos[0]-this.moveSpeed); //ensure it cant pass divider (100)\n    }\n\n    grantXP(player) {\n        player.xp += this.xpGranted;\n    }\n}\n\nmodule.exports = Enemy;\n\n//# sourceURL=webpack://js-project/./src/enemy.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Player = __webpack_require__(/*! ./player.js */ \"./src/player.js\");\nconst Rat = __webpack_require__(/*! ./rat.js */ \"./src/rat.js\");\nconst ItemManager = __webpack_require__(/*! ./item_manager.js */ \"./src/item_manager.js\");\nconst Satyr = __webpack_require__(/*! ./satyr.js */ \"./src/satyr.js\");\nconst RedOgre = __webpack_require__(/*! ./red_ogre.js */ \"./src/red_ogre.js\");\nconst Werewolf = __webpack_require__(/*! ./werewolf.js */ \"./src/werewolf.js\");\nconst Util = __webpack_require__(/*! ./util.js */ \"./src/util.js\");\nconst Golem = __webpack_require__(/*! ./golem.js */ \"./src/golem.js\");\n\nconst DIM_X = 700; //canvas width\nconst DIM_Y = 400; //canvas height\nconst DIV = 100; //X value that enemies cannot cross;\nconst BUFFER = 50; //space between enemies\nconst SPAWN_DELAY = 50; //ammount of calls it takes an enemy to spawn\n\nclass Game {\n\n    constructor(gameView) {\n        this.player = new Player();\n        this.enemies = [];\n        this.itemManager = new ItemManager();\n        this.combatCounter = 0;\n        this.fbSpawned = false;\n\n        //load background imgs\n        this.bg1 = new Image();\n        this.bg2 = new Image();\n        this.bg3 = new Image();\n        this.bg4 = new Image();\n        this.bg1.src = \"./images/background/DarkForest/DarkForest_Background.png\";\n        this.bg2.src = \"./images/background/DarkForest/DarkForest_Middleground.png\";\n        // this.bg3.src = \"./images/background/DarkForest/DarkForest_Shadow.png\";\n        this.bg4.src = \"./images/background/DarkForest/DarkForest_Foreground.png\";\n        this.spawnTimer = SPAWN_DELAY;\n\n        //allows pause/speed up from within game class\n        this.gameView = gameView;\n\n        //the code below is necessary for removing/adding event listeners in the levelUp function\n        function itemChosen(item) {\n            item.applyStats(this.player);\n            document.getElementById(\"overlay\").style.display = \"none\";\n            this.gameView.play();\n        }\n\n        this.threeItems = this.itemManager.get3RandomItems();\n\n        this.event1 = (e)=>{itemChosen.bind(this)(this.threeItems[0])}\n        this.event2 = (e)=>{itemChosen.bind(this)(this.threeItems[1])}\n        this.event3 = (e)=>{itemChosen.bind(this)(this.threeItems[2])}\n    }\n\n    //animate a frame of the game\n    draw(ctx) {\n        ctx.clearRect(0,0,DIM_X,DIM_Y);\n\n        //draw background\n        ctx.drawImage(this.bg1,0,0,DIM_X,DIM_Y);\n        ctx.drawImage(this.bg2,0,0,DIM_X,DIM_Y);\n        // ctx.drawImage(this.bg3,0,0,DIM_X,DIM_Y);\n        ctx.drawImage(this.bg4,0,0,DIM_X,DIM_Y);\n\n        //draw player\n        this.player.healthBar.draw([this.player.pos[0]+25,this.player.pos[1]+30]);\n        if (this.canFight()) {\n            this.player.animateAttack();\n        } else {\n            this.player.animateIdle();\n        }\n    \n        //draw enemies\n        for (let i = 0; i < this.enemies.length; i++) {\n            this.enemies[i].draw(this.enemies,i,this.player);\n        }\n    }\n\n    //step the game logic by one frame\n    step() {\n        this.updateStatDisplay();\n        this.spawnAnEnemy();\n        this.moveEnemies();\n        this.resolveAttacks();\n        if (this.player.xp >= 100) this.levelUp();\n    }\n\n    //move enemys forward if possible and keep them from being on top of each other\n    moveEnemies() {\n        for (let i = 0; i < this.enemies.length; i++) {\n\n            //the front enemy can only move if they haven't reached the divider\n            if (i === 0 && !this.canFight()) {\n                    this.enemies[0].move();\n\n            //subsequent enemys must stay BUFFER distance away from the next enemy\n            } else if (i !== 0 && this.enemies[i].pos[0] - this.enemies[i].moveSpeed > this.enemies[i-1].pos[0] + BUFFER) {\n                this.enemies[i].move();\n            }\n        }\n    }\n\n    //create a new enemy every SPAWN_DELAY frames\n    spawnAnEnemy() {\n\n        //spawn final boss\n        if (this.player.level === 10) {\n            if (!this.fbSpawned) {\n                let fb = new Golem();\n                this.enemies.push(fb);\n                this.fbSpawned = true;\n            }\n\n            if (this.enemies.length === 0) this.youWin();\n\n            return;\n        }\n\n        //enemy type is random but depends on player level\n        let enemy;\n        let min = Math.max(this.player.level-3,0);\n        let max = this.player.level;\n        let randomNum = Util.getRandomInt(min,max);\n        switch(randomNum) {\n            case 0:\n                enemy = new Rat();\n                break;\n            case 1:\n            case 2:\n            case 3:\n                enemy = new Satyr();\n                break;\n            case 4:\n            case 5:\n            case 6:\n                enemy = new RedOgre();\n                break;\n\n            case 7:\n            case 8:\n            case 9:\n                enemy = new Werewolf();\n                break;\n            default:\n                enemy = new Rat();\n        }\n\n        if (this.spawnTimer < 1) {\n            this.enemies.push(enemy);\n            this.spawnTimer = SPAWN_DELAY;\n        } else {\n            this.spawnTimer--;\n        }\n    }\n\n    //\n    resolveAttacks() {\n\n        //attacks should only occur every 4 frames to line up with the player's attacck\n        this.combatCounter++;\n        if (this.combatCounter < 5) return;\n        this.combatCounter = 0;\n\n        //combat only starts if an enemy is next to the player, ie at the divider\n        if (this.canFight()) {\n\n            //player attacks\n            // if (this.player.attackHits()) console.log(`${this.player.name} deals ${this.player.attack(this.enemies[0])} damage!`);\n            if (this.player.attackHits()) this.player.attack(this.enemies[0]);\n\n            //enemy attacks\n            if (this.enemies[0].attackHits()) console.log(`${this.enemies[0].name} deals ${this.enemies[0].attack(this.player)} damage!`);\n            // if (this.enemies[0].attackHits()) this.enemies[0].attack(this.player);\n\n            //kill player if their health goes sub 0\n            //enemy health handled in their draw method\n            if (this.player.currHealth <= 0) {\n                this.gameOver();\n            }\n        }\n    }\n\n    //helper method to tell if enemies are in swinging distance\n    canFight() {\n        return this.enemies[0] && this.enemies[0].pos[0] <= DIV;\n    }\n\n    gameOver() {\n        this.gameView.pause();\n        document.getElementById(\"overlay-options\").style.display = \"none\";\n        document.getElementById(\"overlay-end\").style.display = \"block\";\n        document.getElementById(\"overlay\").style.display = \"block\";       \n    }\n\n    youWin() {\n        this.gameView.pause();\n        // alert(\"You Win!\");\n        document.getElementById(\"overlay-options\").style.display = \"none\";\n        document.getElementById(\"overlay-win\").style.display = \"block\";\n        document.getElementById(\"overlay\").style.display = \"block\";\n    }\n\n    levelUp() {\n        console.log(`${this.player.name} leveled up!`);\n        this.player.level++;\n        this.player.xp = 0;\n\n        //give player full health on level up\n        //this.player.currHealth = this.player.maxHealth;\n        //this.player.healthBar.setHealth(this.player.maxHealth);\n\n        this.gameView.pause();\n        \n        this.threeItems = this.itemManager.get3RandomItems();\n\n        //display item images\n        document.getElementById(\"item1-pic\").src = this.threeItems[0].img;\n        document.getElementById(\"item2-pic\").src = this.threeItems[1].img;\n        document.getElementById(\"item3-pic\").src = this.threeItems[2].img;\n\n        //change button names\n        const button1 = document.getElementById(\"item1-button\");\n        button1.innerHTML = this.threeItems[0].name;\n        const button2 = document.getElementById(\"item2-button\");\n        button2.innerHTML = this.threeItems[1].name;\n        const button3 = document.getElementById(\"item3-button\");\n        button3.innerHTML = this.threeItems[2].name;\n\n        //show the items overlay\n        const overlay = document.getElementById(\"overlay\");\n        overlay.style.display = \"block\";\n        \n        //give each button a fresh event listener\n        button1.removeEventListener(\"click\",this.event1);\n        button1.addEventListener(\"click\",this.event1);\n        \n        button2.removeEventListener(\"click\",this.event2);\n        button2.addEventListener(\"click\",this.event2);\n\n        button3.removeEventListener(\"click\",this.event3);\n        button3.addEventListener(\"click\",this.event3);\n    }\n\n    updateStatDisplay() {\n        // document.getElementById(\"player-name\").innerHTML = `Name: ${this.player.name}`;\n        document.getElementById(\"player-level\").innerHTML = `Level: ${this.player.level}`;\n        document.getElementById(\"player-xp\").innerHTML = `XP: ${this.player.xp}/100`;\n        document.getElementById(\"player-health\").innerHTML = `Health: ${this.player.currHealth}/${this.player.maxHealth}`;\n        document.getElementById(\"player-hitchance\").innerHTML = `Hit Chance: ${this.player.hitChance}`;\n        document.getElementById(\"player-damage\").innerHTML = `Damage: ${this.player.damage}`;\n        document.getElementById(\"player-armor\").innerHTML = `Armor: ${this.player.armor}`;\n        document.getElementById(\"player-lifesteal\").innerHTML = `Life Steal: ${this.player.lifeSteal}`;\n    }\n\n}\n\nmodule.exports = Game;\n\n//# sourceURL=webpack://js-project/./src/game.js?");

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Game = __webpack_require__(/*! ./game.js */ \"./src/game.js\");\n\nclass GameView {\n    constructor(ctx) {\n        this.frame = 0;\n        this.ctx = ctx;\n        this.paused = false;\n        this.frameCap = 10;\n        this.game = new Game(this);\n    }\n\n    step() {\n        this.frame++;\n        if (this.frame < this.frameCap) {\n            window.requestAnimationFrame(this.step.bind(this));\n            return;\n        }\n        this.frame = 0;\n        if (!this.paused) {\n            this.game.step(this.frame);\n        }\n        this.game.draw(ctx,this.frame,this.step.bind(this));\n        window.requestAnimationFrame(this.step.bind(this));\n    }\n\n    pause() {\n        this.paused = true;\n    }\n\n    play() {\n        this.paused = false;\n    }\n\n    slideSpeed(speed) {\n        this.frameCap = speed;\n    }\n}\n\nmodule.exports = GameView;\n\n//# sourceURL=webpack://js-project/./src/game_view.js?");

/***/ }),

/***/ "./src/golem.js":
/*!**********************!*\
  !*** ./src/golem.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Enemy = __webpack_require__(/*! ./enemy */ \"./src/enemy.js\");\n\nconst WIDTH = 74;\nconst HEIGHT = 57;\nconst BUFFER = 60;\n\nclass Golem extends Enemy {\n\n    constructor() {\n        //health: 50, hitChance: .8, damage: 25, armor: 8, pos: [], name: Golem, moveSpeed: 10, xpGranted: 0\n        super(50,.8,25,8,[650,280],\"Golem\",10,0);\n\n        this.sprite = new Image();\n        this.sprite.src = \"./images/enemy/monsters/Golem/golem-Sheet.png\";\n\n        this.walkLoop = [0,1,2,3,4];\n        this.walkIndex = 0;\n\n        this.attackLoop = [0,1,2,3,4,0,1,2,3,4];\n        this.attackIndex = 0;\n\n        this.dieLoop = [3,4,5,0,1,2,3,4];\n        this.dieIndex = 0;\n\n        this.idleLoop = [0,1,2,3];\n        this.idleIndex = 0;\n    }\n\n    draw(enemies,i,player) {\n        this.healthBar.draw([this.pos[0]+50,this.pos[1]-5]);\n        if (this.currHealth <= 0) {\n            this.die(enemies,player);\n        } else if (i === 0 && this.pos[0] <= 100) {\n            this.animateAttack();\n        } else if ((i === 0 && this.pos[0] > 100) || enemies[i-1].pos[0] < this.pos[0] - BUFFER) {\n            this.walk();\n        } else {\n            this.idle();\n        }\n    }\n\n    idle() {\n        ctx.drawImage(this.sprite, WIDTH*this.idleLoop[this.idleIndex], 0, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.idleIndex++\n        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;\n    }\n\n    walk() {\n        ctx.drawImage(this.sprite, WIDTH*this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.walkIndex++\n        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;\n    }\n\n    animateAttack() {\n        let h = this.attackIndex > 4 ? 3 : 2;\n        ctx.drawImage(this.sprite, WIDTH*this.attackLoop[this.attackIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.attackIndex++\n        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;\n    }\n\n    die(enemies,player) {\n        let h = this.dieIndex > 2 ? 6 : 5;\n        ctx.drawImage(this.sprite, WIDTH*this.dieLoop[this.dieIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.dieIndex++\n        if (this.dieIndex >= this.dieLoop.length) {\n            // this.dieIndex =0\n            // console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);\n            this.grantXP(player);\n            enemies.shift();\n        }\n    }\n}\n\nmodule.exports = Golem;\n\n//# sourceURL=webpack://js-project/./src/golem.js?");

/***/ }),

/***/ "./src/healthbar.js":
/*!**************************!*\
  !*** ./src/healthbar.js ***!
  \**************************/
/***/ ((module) => {

eval("class HealthBar {\n\n    constructor(health,pos) {\n        this.maxHealth = health;\n        this.curHealth = health;\n        this.pos = pos;\n    }\n\n    draw(pos) {\n        this.pos = pos;\n        if (this.curHealth !== this.maxHealth) {\n            ctx.beginPath();\n            ctx.fillStyle = \"red\";\n            ctx.fillRect(this.pos[0],this.pos[1],50,10);\n            ctx.fillStyle = \"green\";\n            let hbarWidth = Math.max((this.curHealth/this.maxHealth),0);\n            ctx.fillRect(this.pos[0],this.pos[1],50*hbarWidth,10);\n        }\n    }\n\n    subtractHealth(health) {\n        this.curHealth -= health;\n    }\n\n    addHealth(health) {\n        this.curHealth += health;\n    }\n\n    setHealth(health) {\n        this.curHealth = health;\n    }\n\n\n}\n\nmodule.exports = HealthBar;\n\n//# sourceURL=webpack://js-project/./src/healthbar.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const GameView = __webpack_require__(/*! ./game_view.js */ \"./src/game_view.js\");\n\nconst canvas = document.getElementById(\"game-canvas\");\ncanvas.width = 700;\ncanvas.height = 400;\nconst ctx = canvas.getContext(\"2d\");\nwindow.ctx = ctx;\n\nconst gameView = new GameView(ctx);\ngameView.pause();\nconst overlay = document.getElementById(\"overlay\");\nconst instructions = document.getElementById(\"overlay-instructions\");\ndocument.getElementById(\"instructions-button\").addEventListener(\"click\",()=>{\n    instructions.style.display = \"none\";\n    overlay.style.display = \"none\";\n    document.getElementById(\"overlay-options\").style.display = \"flex\";\n    gameView.play();\n});\n\ndocument.getElementById(\"restart-button\").addEventListener(\"click\",()=>{\n    document.getElementById(\"overlay-end\").style.display = \"none\";\n    window.location.reload();\n});\n\ndocument.getElementById(\"restart-button2\").addEventListener(\"click\",()=>{\n    document.getElementById(\"overlay-win\").style.display = \"none\";\n    window.location.reload();\n});\n\nconst slider = document.getElementById(\"speed-slider\")\nslider.addEventListener(\"change\",()=>{\n    gameView.slideSpeed(slider.value);\n});\nwindow.requestAnimationFrame(()=>gameView.step());\n\n//# sourceURL=webpack://js-project/./src/index.js?");

/***/ }),

/***/ "./src/item.js":
/*!*********************!*\
  !*** ./src/item.js ***!
  \*********************/
/***/ ((module) => {

eval("class Item {\n\n    constructor(healthGranted, damageGranted, hitChanceGranted, armorGranted, lifeStealGranted, name, img) {\n        this.healthGranted = healthGranted;\n        this.damageGranted = damageGranted;\n        this.hitChanceGranted = hitChanceGranted;\n        this.armorGranted = armorGranted;\n        this.lifeStealGranted = lifeStealGranted;\n        this.name = name;\n        this.img = img;\n    }\n\n    applyStats(player) {\n        player.maxHealth += this.healthGranted;\n        player.currHealth += this.healthGranted;\n        player.healthBar.maxHealth += this.healthGranted;\n        player.healthBar.curHealth += this.healthGranted;\n        player.damage += this.damageGranted;\n        player.hitChance += this.hitChanceGranted;\n        player.armor += this.armorGranted;\n        player.lifeSteal += this.lifeStealGranted;\n        // console.log(`${player.name} chose ${this.name}`);\n    }\n}\n\nmodule.exports = Item;\n\n//# sourceURL=webpack://js-project/./src/item.js?");

/***/ }),

/***/ "./src/item_manager.js":
/*!*****************************!*\
  !*** ./src/item_manager.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Item = __webpack_require__(/*! ./item */ \"./src/item.js\");\nconst Util = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\nclass ItemManager {\n\n    constructor() {\n        this.items = [];\n        this.generateItemList();\n    }\n\n    generateItemList() {\n        const hpUp = new Item(50,0,0,0,0,\"Health Up\",\"./images/items/health.png\");\n        this.items.push(hpUp);\n\n        const dmgUp = new Item(0,3,0,0,0,\"Damage Up\",\"./images/items/damage.png\");\n        this.items.push(dmgUp);\n\n        const hitChanceUp = new Item(0,0,.05,0,0,\"Hit Chance Up\",\"./images/items/hitchance.png\");\n        this.items.push(hitChanceUp);\n\n        const armorUp = new Item(0,0,0,3,0,\"Armor Up\",\"./images/items/armor.png\");\n        this.items.push(armorUp);\n\n        const lifeStealUp = new Item(0,0,0,0,0.1,\"Lifesteal Up\",\"./images/items/lifesteal.png\");\n        this.items.push(lifeStealUp);\n\n        const lsUpHpDown = new Item(-50,0,0,0,0.2,\"Lifesteal +2/HP -1\",\"./images/items/ls2hp-1.png\");\n        this.items.push(lsUpHpDown);\n        \n        // const item = new Item(0,0,0,0,0,\"\",\"\");\n        // this.items.push(item);\n    }\n\n    get3RandomItems() {\n        let items = [];\n        while (items.length < 3) {\n            let i = Util.getRandomInt(0,this.items.length);\n            if (!items.includes(this.items[i])) items.push(this.items[i]);\n        }\n        return items;\n    }\n}\n\nmodule.exports = ItemManager;\n\n//# sourceURL=webpack://js-project/./src/item_manager.js?");

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Character = __webpack_require__(/*! ./character */ \"./src/character.js\");\n\nconst WIDTH = 90;\nconst HEIGHT = 80;\n\nclass Player extends Character {\n\n    constructor(name = \"Player\") {\n        //health: 200, hitChance: .7, damage: 5, armor: 0, pos: [20,290]\n        super(200,.7,5,0,[10,270],name);\n        this.level = 0;\n        this.xp = 0;\n        \n        this.sprite = new Image();\n        this.sprite.src = \"./images/player/AnimatedPixelKnight/knight-sprite-sheet.png\";\n\n        this.attackLoop = [0,1,2,3,4];\n        this.attackIndex = 0;\n        \n        this.idleLoop = [1,2,3,4];\n        this.idleIndex = 0;\n    }\n\n    animateAttack() {\n        ctx.drawImage(this.sprite,WIDTH*this.attackLoop[this.attackIndex],HEIGHT,WIDTH,HEIGHT,this.pos[0],this.pos[1],WIDTH*1.5,HEIGHT*1.5);\n        this.attackIndex++;\n        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;\n    }\n\n    animateIdle() {\n        ctx.drawImage(this.sprite,WIDTH*this.idleLoop[this.idleIndex],0,WIDTH,HEIGHT,this.pos[0],this.pos[1],WIDTH*1.5,HEIGHT*1.5);\n        this.idleIndex++;\n        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;\n    }\n\n}\n\nmodule.exports = Player;\n\n//# sourceURL=webpack://js-project/./src/player.js?");

/***/ }),

/***/ "./src/rat.js":
/*!********************!*\
  !*** ./src/rat.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Enemy = __webpack_require__(/*! ./enemy */ \"./src/enemy.js\");\n\nconst WIDTH = 42;\nconst HEIGHT = 22;\nconst BUFFER = 60; //space between enemies\n\nclass Rat extends Enemy {\n\n    constructor() {\n        //health: 10, hitChance: .6, damage: 5, armor: 0, pos: [650,330], name: Rat, moveSpeed: 10, xpGranted: 20\n        super(10,.5,3,0,[650,350],\"Rat\",10,20);\n\n        this.sprite = new Image();\n        this.sprite.src = \"./images/enemy/monsters/Rat/rat-Sheet.png\";\n\n        this.walkLoop = [0,1,2,3];\n        this.walkIndex = 0;\n\n        this.attackLoop = [0,1,2,3];\n        this.attackIndex = 0;\n\n        this.dieLoop = [0,1,2,3];\n        this.dieIndex = 0;\n\n        this.idleLoop = [0,1,2,3];\n        this.idleIndex = 0;\n    }\n\n    draw(enemies,i,player) {\n        this.healthBar.draw(this.pos);\n        if (this.currHealth <= 0) {\n            this.die(enemies,player);\n        } else if (i === 0 && this.pos[0] <= 100) {\n            this.animateAttack();\n        } else if ((i === 0 && this.pos[0] > 100) || enemies[i-1].pos[0] < this.pos[0] - BUFFER) {\n            this.walk();\n        } else {\n            this.idle();\n        }\n    }\n\n    walk() {\n        ctx.drawImage(this.sprite,WIDTH * this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.walkIndex++;\n        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;\n    }\n\n    animateAttack() {\n        ctx.drawImage(this.sprite,WIDTH * this.attackLoop[this.attackIndex], HEIGHT * 2, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.attackIndex++;\n        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;\n    }\n\n    idle() {\n        ctx.drawImage(this.sprite,WIDTH * this.idleLoop[this.idleIndex], HEIGHT * 4, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.idleIndex++;\n        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;\n    }\n\n    die(enemies,player) {\n        ctx.drawImage(this.sprite,WIDTH * this.dieLoop[this.dieIndex], HEIGHT * 5, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.dieIndex++;\n        if (this.dieIndex >= this.dieLoop.length) {\n\n            //remove the rat from enemies once it's death animation ends\n            //this.dieIndex = 0;\n            // console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);\n            this.grantXP(player);\n            enemies.shift();\n        }\n    }\n\n}\n\nmodule.exports = Rat;\n\n//# sourceURL=webpack://js-project/./src/rat.js?");

/***/ }),

/***/ "./src/red_ogre.js":
/*!*************************!*\
  !*** ./src/red_ogre.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Enemy = __webpack_require__(/*! ./enemy */ \"./src/enemy.js\");\n\nconst WIDTH = 73;\nconst HEIGHT = 46;\nconst BUFFER = 60;\n\nclass RedOgre extends Enemy {\n\n    constructor() {\n        //health: 25, hitChance: .8, damage: 15, armor: 2, pos: [], name: Red Ogre, moveSpeed: 15, xpGranted: \n        super(20,.7,10,2,[650,290],\"Red Ogre\",10,20);\n\n        this.sprite = new Image();\n        this.sprite.src = \"./images/enemy/monsters/RedOgre/red-ogre-Sheet.png\";\n\n        this.walkLoop = [0,1,2,3,4];\n        this.walkIndex = 0;\n\n        this.attackLoop = [0,1,2,3,4,0,1,2,3,4];\n        this.attackIndex = 0;\n\n        this.dieLoop = [0,1,2,3,4,0,1,2];\n        this.dieIndex = 0;\n\n        this.idleLoop = [0,1,2,3];\n        this.idleIndex = 0;\n    }\n\n    draw(enemies,i,player) {\n        this.healthBar.draw([this.pos[0]+50,this.pos[1]-5]);\n        if (this.currHealth <= 0) {\n            this.die(enemies,player);\n        } else if (i === 0 && this.pos[0] <= 100) {\n            this.animateAttack();\n        } else if ((i === 0 && this.pos[0] > 100) || enemies[i-1].pos[0] < this.pos[0] - BUFFER) {\n            this.walk();\n        } else {\n            this.idle();\n        }\n    }\n\n    idle() {\n        ctx.drawImage(this.sprite, WIDTH*this.idleLoop[this.idleIndex], 0, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.idleIndex++\n        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;\n    }\n\n    walk() {\n        ctx.drawImage(this.sprite, WIDTH*this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.walkIndex++\n        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;\n    }\n\n    animateAttack() {\n        let h = this.attackIndex > 4 ? 3 : 2;\n        ctx.drawImage(this.sprite, WIDTH*this.attackLoop[this.attackIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.attackIndex++\n        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;\n    }\n\n    die(enemies,player) {\n        let h = this.dieIndex > 4 ? 5 : 4;\n        if (this.dieIndex > 4) h = 5;\n        ctx.drawImage(this.sprite, WIDTH*this.dieLoop[this.dieIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.dieIndex++\n        if (this.dieIndex >= this.dieLoop.length) {\n            //this.dieIndex = 0;\n            // console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);\n            this.grantXP(player);\n            enemies.shift();\n        }\n    }\n}\n\nmodule.exports = RedOgre;\n\n//# sourceURL=webpack://js-project/./src/red_ogre.js?");

/***/ }),

/***/ "./src/satyr.js":
/*!**********************!*\
  !*** ./src/satyr.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Enemy = __webpack_require__(/*! ./enemy */ \"./src/enemy.js\");\n\nconst WIDTH = 68;\nconst HEIGHT = 46;\nconst BUFFER = 60;\n\nclass Satyr extends Enemy {\n\n    constructor() {\n        //health: 15, hitChance: .7, damage: 8, armor: 0, pos: [], name: Satyr, moveSpeed: 10, xpGranted: 30\n        super(15,.7,5,0,[650,300],\"Satyr\",10,15);\n\n        this.sprite = new Image();\n        this.sprite.src = \"./images/enemy/monsters/Satyr/satyr-Sheet.png\";\n\n        this.walkLoop = [0,1,2,3,4];\n        this.walkIndex = 0;\n\n        this.attackLoop = [0,1,2,3,4];\n        this.attackIndex = 0;\n\n        this.dieLoop = [0,1,2,3,4,0,1,2];\n        this.dieIndex = 0;\n\n        this.idleLoop = [0,1,2,3];\n        this.idleIndex = 0;\n    }\n\n    draw(enemies,i,player) {\n        this.healthBar.draw([this.pos[0]+50,this.pos[1]-5]);\n        if (this.currHealth <= 0) {\n            this.die(enemies,player);\n        } else if (i === 0 && this.pos[0] <= 100) {\n            this.animateAttack();\n        } else if ((i === 0 && this.pos[0] > 100) || enemies[i-1].pos[0] < this.pos[0] - BUFFER) {\n            this.walk();\n        } else {\n            this.idle();\n        }\n    }\n\n    idle() {\n        ctx.drawImage(this.sprite, WIDTH*this.idleLoop[this.idleIndex], 0, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.idleIndex++\n        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;\n    }\n\n    walk() {\n        ctx.drawImage(this.sprite, WIDTH*this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.walkIndex++\n        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;\n    }\n\n    animateAttack() {\n        ctx.drawImage(this.sprite, WIDTH*this.attackLoop[this.attackIndex], HEIGHT * 2, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.attackIndex++\n        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;\n    }\n\n    die(enemies,player) {\n        let h = 4;\n        if (this.dieIndex > 4) h = 5;\n        ctx.drawImage(this.sprite, WIDTH*this.dieLoop[this.dieIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.dieIndex++\n        if (this.dieIndex >= this.dieLoop.length) {\n            //this.dieIndex = 0;\n            // console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);\n            this.grantXP(player);\n            enemies.shift();\n        }\n    }\n}\n\nmodule.exports = Satyr;\n\n//# sourceURL=webpack://js-project/./src/satyr.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((module) => {

eval("const Util = {\n    getRandomInt(min, max) {\n        min = Math.ceil(min);\n        max = Math.floor(max);\n        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive\n    }\n}\n\nmodule.exports = Util;\n\n//# sourceURL=webpack://js-project/./src/util.js?");

/***/ }),

/***/ "./src/werewolf.js":
/*!*************************!*\
  !*** ./src/werewolf.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Enemy = __webpack_require__(/*! ./enemy */ \"./src/enemy.js\");\n\nconst WIDTH = 73;\nconst HEIGHT = 43;\nconst BUFFER = 60;\n\nclass Werewolf extends Enemy {\n\n    constructor() {\n        //health: 30, hitChance: .8, damage: 15, armor: 1, pos: [], name: Werewolf, moveSpeed: 10, xpGranted: 30\n        super(25,.8,15,1,[650,300],\"Werewolf\",10,30);\n        this.lifeSteal = .3;\n\n        this.sprite = new Image();\n        this.sprite.src = \"./images/enemy/monsters/Werewolf/werewolf-Sheet.png\";\n\n        this.walkLoop = [0,1,2,3,4];\n        this.walkIndex = 0;\n\n        this.attackLoop = [0,1,2,3,4,0,1,2,3,4];\n        this.attackIndex = 0;\n\n        this.dieLoop = [0,1,2,3,4,0,1,2];\n        this.dieIndex = 0;\n\n        this.idleLoop = [0,1,2,3];\n        this.idleIndex = 0;\n    }\n\n    draw(enemies,i,player) {\n        this.healthBar.draw([this.pos[0]+50,this.pos[1]-5]);\n        if (this.currHealth <= 0) {\n            this.die(enemies,player);\n        } else if (i === 0 && this.pos[0] <= 100) {\n            this.animateAttack();\n        } else if ((i === 0 && this.pos[0] > 100) || enemies[i-1].pos[0] < this.pos[0] - BUFFER) {\n            this.walk();\n        } else {\n            this.idle();\n        }\n    }\n\n    idle() {\n        ctx.drawImage(this.sprite, WIDTH*this.idleLoop[this.idleIndex], 0, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);\n        this.idleIndex++\n        if (this.idleIndex >= this.idleLoop.length) this.idleIndex = 0;\n    }\n\n    walk() {\n        ctx.drawImage(this.sprite, WIDTH*this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.walkIndex++\n        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;\n    }\n\n    animateAttack() {\n        let h = this.attackIndex > 4 ? 3 : 2;\n        ctx.drawImage(this.sprite, WIDTH*this.attackLoop[this.attackIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.attackIndex++\n        if (this.attackIndex >= this.attackLoop.length) this.attackIndex = 0;\n    }\n\n    die(enemies,player) {\n        let h = this.dieIndex > 4 ? 5 : 4;\n        if (this.dieIndex > 4) h = 5;\n        ctx.drawImage(this.sprite, WIDTH*this.dieLoop[this.dieIndex], HEIGHT * h, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2)\n        this.dieIndex++\n        if (this.dieIndex >= this.dieLoop.length) {\n            //this.dieIndex = 0;\n            // console.log(`The ${this.name} dies granting ${this.xpGranted} xp`);\n            this.grantXP(player);\n            enemies.shift();\n        }\n    }\n}\n\nmodule.exports = Werewolf;\n\n//# sourceURL=webpack://js-project/./src/werewolf.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;