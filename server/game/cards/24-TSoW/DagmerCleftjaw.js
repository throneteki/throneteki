import DrawCard from '../../drawcard.js';

class DagmerCleftjaw extends DrawCard {
    // Dagmer Cleftjaw (24004)
    // Pillage. Shadow (4). Stealth.
    // While there is a Winter plot card revealed, you may marshal Dagmer Cleftjaw into shadows from
    // your dead pile as if he were in your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.game.anyPlotHasTrait('Winter'),
            targetController: 'current',
            effect: ability.effects.canMarshalIntoShadows(
                (card, context) => card === context.source && card.location === 'dead pile'
            )
        });
    }
}

DagmerCleftjaw.code = '24004';

export default DagmerCleftjaw;
