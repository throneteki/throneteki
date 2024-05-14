import DrawCard from '../../drawcard.js';

class NorthernRefugee extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.anyPlotHasTrait('Winter'),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', 1)
        });
    }
}

NorthernRefugee.code = '04117';

export default NorthernRefugee;
