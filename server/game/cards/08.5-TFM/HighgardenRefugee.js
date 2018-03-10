const DrawCard = require('../../drawcard.js');

class HighgardenRefugee extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.anyPlotHasTrait('Summer'),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', 1)
        });
    }
}

HighgardenRefugee.code = '08083';

module.exports = HighgardenRefugee;
