const PlotCard = require('../../plotcard.js');

class ForgottenPlans extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase !== 'plot',
            match: (card) => card.getType() === 'plot' && !card.hasTrait('Scheme'),
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

ForgottenPlans.code = '02119';

module.exports = ForgottenPlans;
