const Item = require("./item");
const Util = require("./util");

class ItemManager {

    constructor() {
        this.items = [];
        this.generateItemList();
    }

    generateItemList() {
        const hpUp = new Item(25,0,0,"Health Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/Rogue Like Items/item_12.png");
        this.items.push(hpUp);

        const dmgUp = new Item(0,1,0,"Damage Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/Rogue Like Items/item_3.png");
        this.items.push(dmgUp);

        const hitChanceUp = new Item(0,0,.05,"Hit Chance Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/Rogue Like Items/item_11.png");
        this.items.push(hitChanceUp);
    }

    get3RandomItems() {
        let items = [];
        while (items.length < 3) {
            let i = Util.getRandomInt(0,this.items.length);
            if (!items.includes(this.items[i])) items.push(this.items[i]);
        }
        return items;
    }
}

module.exports = ItemManager;