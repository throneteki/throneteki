const uuid = require('node-uuid');

class BaseCard {
    constructor(owner, cardData) {
        this.owner = owner;
        this.game = this.owner.game;
        this.cardData = cardData;

        this.uuid = uuid.v1();
        this.code = cardData.code;
        this.name = cardData.name;
        this.facedown = false;
        this.inPlay = false;
    }

    hasKeyword(keyword) {
        if(!this.cardData.text) {
            return false;
        }

        return this.cardData.text.toLowerCase().indexOf(keyword.toLowerCase() + '.') !== -1;
    }

    hasTrait(trait) {
        return this.cardCard.traits && this.cardData.traits.indexOf(trait + '.') !== -1;
    }

    leavesPlay() {
        this.inPlay = false;
    }

    canReduce() {
        return false;
    }

    getInitiative() {
        return 0;
    }

    getIncome() {
        return 0;
    }

    getReserve() {
        return 0;
    }

    isUnique() {
        return this.cardData.is_unique;
    }

    getType() {
        return this.cardData.type_code;
    }

    reduce(card, cost) {
        return cost;
    }

    modifyClaim(player, type, claim) {
        return claim;
    }

    getSummary(isActivePlayer, hideWhenFaceup) {
        return isActivePlayer || (!this.facedown && !hideWhenFaceup) ? {
            code: this.cardData.code,
            facedown: this.facedown,
            name: this.cardData.name,
            type: this.cardData.type_code,
            uuid: this.uuid
        } : { facedown: true };
    }
}

module.exports = BaseCard;
