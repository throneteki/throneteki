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
            const countForRarity = rarity.cards.reduce((count, cardQuantity) => count + cardQuantity.count, 0);
            counts.push(Math.floor(countForRarity / rarity.numPerPack));
        }
        return Math.min(...counts);
    }

    cloneCardPool() {
        const cardPool = {};
        for(const rarity of this.rarities) {
            cardPool[rarity.name] = this.flattenCardQuantities(rarity.cards);
        }
        return cardPool;
    }

    flattenCardQuantities(cardQuantities) {
        const cards = [];
        for(const cardQuantity of cardQuantities) {
            for(let i = 0; i < cardQuantity.count; ++i) {
                cards.push(cardQuantity.cardCode);
            }
        }
        return cards;
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
