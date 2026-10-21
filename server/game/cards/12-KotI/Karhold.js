import DrawCard from '../../drawcard.js';

class Karhold extends DrawCard {
    // Karhold (12034)
    // While a player does not have a Winter plot card revealed, characters and locations he or she
    // controls cannot gain power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => true,
            match: (card, context) =>
                ['character', 'location'].includes(card.getType()) &&
                !context.source.hasWinterPlotRevealed(card.controller),
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });
    }

    hasWinterPlotRevealed(controller) {
        return controller.activePlot && controller.activePlot.hasTrait('Winter');
    }
}

Karhold.code = '12034';

export default Karhold;
