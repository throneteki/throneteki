const DrawCard = require('../../drawcard');

class Karhold extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => true,
            match: (card) =>
                ['character', 'location'].includes(card.getType()) &&
                !this.hasWinterPlotRevealed(card.controller),
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });
    }

    hasWinterPlotRevealed(controller) {
        return controller.activePlot && controller.activePlot.hasTrait('Winter');
    }
}

Karhold.code = '12034';

module.exports = Karhold;
