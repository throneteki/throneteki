const DrawCard = require('../../drawcard.js');

class LonelyHill extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.plotDeck.length > 1,
            targetController: 'current',
            // TODO: Non-dynamic used plots effect
            effect: ability.effects.dynamicUsedPlots(() => -1)
        });
    }
}

LonelyHill.code = '25568';
LonelyHill.version = '1.0';

module.exports = LonelyHill;
