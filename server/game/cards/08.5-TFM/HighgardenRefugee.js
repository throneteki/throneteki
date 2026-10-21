import DrawCard from '../../drawcard.js';

class HighgardenRefugee extends DrawCard {
    // Highgarden Refugee (08083)
    // While there is a Summer plot card revealed, reduce the cost to marshal Highgarden Refugee by
    // 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.game.anyPlotHasTrait('Summer'),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', 1)
        });
    }
}

HighgardenRefugee.code = '08083';

export default HighgardenRefugee;
