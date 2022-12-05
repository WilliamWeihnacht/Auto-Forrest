class Item {

    constructor(healthGranted, damageGranted, hitChanceGranted, name, img) {
        this.healthGranted = healthGranted;
        this.damageGranted = damageGranted;
        this.hitChanceGranted = hitChanceGranted;
        this.name = name;
        this.img = img;
    }

    applyStats(player) {
        player.maxHealth += this.healthGranted;
        player.currHealth += this.healthGranted;
        player.healthBar.maxHealth += this.healthGranted;
        player.healthBar.curHealth += this.healthGranted;
        player.damage += this.damageGranted;
        player.hitChance += this.hitChanceGranted;
    }
}

module.exports = Item;