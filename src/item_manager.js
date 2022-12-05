const Item = require("./item");
const Util = require("./util");

class ItemManager {

    constructor() {
        this.items = [];
        this.generateItemList();
    }

    generateItemList() {
        const hpUp = new Item(50,0,0,0,0,"Health Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/health.png");
        this.items.push(hpUp);

        const dmgUp = new Item(0,3,0,0,0,"Damage Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/damage.png");
        this.items.push(dmgUp);

        const hitChanceUp = new Item(0,0,.05,0,0,"Hit Chance Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/hitchance.png");
        this.items.push(hitChanceUp);

        const armorUp = new Item(0,0,0,3,0,"Armor Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/armor.png");
        this.items.push(armorUp);

        const lifeStealUp = new Item(0,0,0,0,0.1,"Lifesteal Up","/Users/wwhynot/Documents/AA homework/JS-Project/assets/items/lifesteal.png");
        this.items.push(lifeStealUp);
        
        // const item = new Item(0,0,0,0,0,"","");
        // this.items.push(item);
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