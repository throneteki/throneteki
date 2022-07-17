const LeavePlay = require('../GameActions/LeavePlay');

class PutIntoShadowsCost {
    constructor() {
        this.name = 'putIntoShadows';
    }

    isEligible(card) {
        if(card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }
        return card.location !== 'shadows';
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.putIntoShadows(card, false);
        }
    }
}

module.exports = PutIntoShadowsCost;
