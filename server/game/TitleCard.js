const BaseCard = require('./basecard.js');

class TitleCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.dominanceStrengthModifier = 0;
    }

    supports(...values) {
        this.supporterNames = values;
    }

    rivals(...values) {
        this.rivalNames = values;
    }

    isRival(card) {
        if(!card || card.getType() !== 'title') {
            return false;
        }

        return this.rivalNames.includes(card.name);
    }

    isSupporter(card) {
        if(!card || card.getType() !== 'title') {
            return false;
        }

        return this.supporterNames.includes(card.name);
    }

    modifyDominanceStrength(value) {
        this.dominanceStrengthModifier += value;
    }

    getDominanceStrength() {
        return this.dominanceStrengthModifier;
    }
}

module.exports = TitleCard;
