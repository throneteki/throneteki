import DrawCard from '../../drawcard.js';

class NorthernRefugee extends DrawCard {
    // Northern Refugee (04117)
    // While there is a Winter plot card revealed, reduce the cost to marshal Northern Refugee by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.game.anyPlotHasTrait('Winter'),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', 1)
        });
    }
}

NorthernRefugee.code = '04117';

export default NorthernRefugee;
