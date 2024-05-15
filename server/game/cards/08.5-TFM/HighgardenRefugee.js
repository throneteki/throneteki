import DrawCard from '../../drawcard.js';

class HighgardenRefugee extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.anyPlotHasTrait('Summer'),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', 1)
        });
    }
}

HighgardenRefugee.code = '08083';

export default HighgardenRefugee;
