class Item {

    constructor(healthGranted, damageGranted, hitChanceGranted, armorGranted, lifeStealGranted, name, img) {
        this.healthGranted = healthGranted;
        this.damageGranted = damageGranted;
        this.hitChanceGranted = hitChanceGranted;
        this.armorGranted = armorGranted;
        this.lifeStealGranted = lifeStealGranted;
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
        player.armor += this.armorGranted;
        player.lifeSteal += this.lifeStealGranted;
        // console.log(`${player.name} chose ${this.name}`);
    }
}

module.exports = Item;