class Item {

    constructor(healthGranted, damageGranted, attackSpeedGranted, name, img) {
        this.healthGranted = healthGranted;
        this.damageGranted = damageGranted;
        this.attackSpeedGranted = attackSpeedGranted;
        this.name = name;
        this.img = img;
    }

    applyStats(player) {
        player.health += this.healthGranted;
        player.damage += this.damageGranted;
        player.attackSpeed += this.attackSpeedGranted;
    }
}

module.exports = Item;