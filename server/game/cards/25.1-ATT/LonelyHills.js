import DrawCard from '../../drawcard.js';

class LonelyHills extends DrawCard {
    // Lonely Hills (25012)
    // While Lonely Hills is standing, you are considered to have 1 fewer plot card in your used
    // pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.kneeled && context.source.controller.plotDeck.length > 1,
            targetController: 'current',
            effect: ability.effects.modifyUsedPlots(-1)
        });
    }
}

LonelyHills.code = '25012';

export default LonelyHills;
