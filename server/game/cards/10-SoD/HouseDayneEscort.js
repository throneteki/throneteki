const DrawCard = require('../../drawcard.js');

class HouseDayneEscort extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () =>
                this.location === 'discard pile' && this.controller.getNumberOfUsedPlots() >= 3,
            targetController: 'current',
            effect: ability.effects.canMarshal(
                (card) => card === this && card.location === 'discard pile'
            )
        });
    }
}

HouseDayneEscort.code = '10015';

module.exports = HouseDayneEscort;
