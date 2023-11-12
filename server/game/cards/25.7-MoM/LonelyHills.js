const DrawCard = require('../../drawcard.js');

class LonelyHills extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled && this.controller.plotDeck.length > 1,
            targetController: 'current',
            // TODO: Non-dynamic used plots effect
            effect: ability.effects.dynamicUsedPlots(() => -1)
        });
    }
}

LonelyHills.code = '25568';
LonelyHills.version = '1.2';

module.exports = LonelyHills;
