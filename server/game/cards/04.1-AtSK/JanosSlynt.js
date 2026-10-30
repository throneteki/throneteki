import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class JanosSlynt extends DrawCard {
    // Janos Slynt (04010)
    // Intimidate.
    // Action: Pay 1 gold to give Janos Slynt +2 STR until the end of the phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to give Janos Slynt +2 strength',
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to give {source} +2 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

JanosSlynt.code = '04010';

export default JanosSlynt;
