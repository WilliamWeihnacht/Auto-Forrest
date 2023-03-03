# link: https://williamweihnacht.github.io/Autobattler-js-project/

## Description:
This project is a rougelike autobattler. The idea is that there will be a charecter representing the player that fights waves of enemies automatically. Periodically the player will have a choice of a few power-ups to improve their characters stats or abilites. As the game progresses the enemies will also get more difficult.

## How to play:

### 1. Use the game speed slider to speed things up to your desired pace.

<img width="723" alt="Screen Shot 2023-03-02 at 3 52 36 PM" src="https://user-images.githubusercontent.com/10673921/222592446-fac15322-d3c7-4478-844d-57e5fa028c1c.png">

### 2. When you level up, pick an upgrade.

<img width="716" alt="Screen Shot 2023-03-02 at 3 54 18 PM" src="https://user-images.githubusercontent.com/10673921/222592819-785dae9e-5639-4381-88d0-fed5b999994f.png">

That's about it.

## How it works

The game uses an animation loop meaning that theres a loop which calls on the animate function for each entity (each enemy and the player) each frame of the game:

    draw(ctx) {
        ctx.clearRect(0,0,DIM_X,DIM_Y);

        //draw background
        ctx.drawImage(this.bg1,0,0,DIM_X,DIM_Y);
        ctx.drawImage(this.bg2,0,0,DIM_X,DIM_Y);
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

You can see that the player has two animations animateAttack and animateIdle and which one is used is determined based on if there are any enemies in swinging distance. Enemies work similiarly except they have 4 possible animations (attack, idle, walk, and die).

The animations use a sprite sheet with a sliding window. This means that each time an animation function is called it displays a different cut-out of the sprite sheet using a sliding window formula.

    this.walkLoop = [0,1,2,3];
    this.walkIndex = 0;

    ...
    
    walk() {
        ctx.drawImage(this.sprite,WIDTH * this.walkLoop[this.walkIndex], HEIGHT, WIDTH, HEIGHT, this.pos[0], this.pos[1], WIDTH*2, HEIGHT*2);
        this.walkIndex++;
        if (this.walkIndex >= this.walkLoop.length) this.walkIndex = 0;
    }

this.sprite is the sprite sheet which looks like this:

![rat-Sheet](https://user-images.githubusercontent.com/10673921/222601948-00ef4dc5-6340-42d4-abfd-6b654e1eb3c3.png)

As you can see it has all the animations for the rat which saves space as we only need one image instead of one for each frame or animation.

The drawImage function draws a rectuangular section of the sprite sheet on the canvas and the walkLoop and walkIndex are used to move this rectangle by a fixed offset and display the next frame of the animation on subsequent calls.

## todo list:
1. add music
2. add more upgrades
3. add more enemies
