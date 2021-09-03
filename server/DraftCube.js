const sampleSize = require('lodash.samplesize');
const shuffle = require('lodash.shuffle');

class DraftCube {
    constructor({ _id, name, rarities }) {
        this._id = _id;
        this.name = name;
        this.rarities = rarities;
    }

    generatePacks() {
        const cardPool = this.cloneCardPool();
        const packCount = this.getNumOfPossiblePacks();
        const packs = [];

        for(let i = 0; i < packCount; ++i) {
            let pack = [];
            for(const rarity of this.rarities) {
                pack = pack.concat(this.randomlyChooseAndRemove(cardPool[rarity.name], rarity.numPerPack));
            }
            packs.push(shuffle(pack));
        }

        return packs;
    }

    getNumOfPossiblePacks() {
        const counts = [];
        for(const rarity of this.rarities) {
            counts.push(Math.floor(rarity.cards.length / rarity.numPerPack));
        }
        return Math.min(...counts);
    }

    cloneCardPool() {
        const cardPool = {};
        for(const rarity of this.rarities) {
            cardPool[rarity.name] = [...rarity.cards];
        }
        return cardPool;
    }

    randomlyChooseAndRemove(array, count) {
        const chosen = sampleSize(array, count);
        for(const value of chosen) {
            const index = array.indexOf(value);
            array.splice(index, 1);
        }
        return chosen;
    }
}

module.exports = DraftCube;
