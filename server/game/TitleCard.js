const BaseCard = require('./basecard.js');

class TitleCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.dominanceStrengthModifier = 0;
    }

    modifyDominanceStrength(value) {
        this.dominanceStrengthModifier += value;
    }

    getDominanceStrength() {
        return this.dominanceStrengthModifier;
    }
}

module.exports = TitleCard;
