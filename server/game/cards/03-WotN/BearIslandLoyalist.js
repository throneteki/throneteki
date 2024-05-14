const DrawCard = require('../../drawcard.js');

class BearIslandLoyalist extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) => this.isOtherParticipatingStark(card),
            effect: ability.effects.immuneTo(
                (card) => card.controller !== this.controller && card.getType() === 'event'
            )
        });
    }

    isOtherParticipatingStark(card) {
        return (
            card.isParticipating() &&
            card.controller === this.controller &&
            card.isFaction('stark') &&
            card !== this
        );
    }
}

BearIslandLoyalist.code = '03012';

module.exports = BearIslandLoyalist;
