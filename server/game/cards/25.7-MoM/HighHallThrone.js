const DrawCard = require('../../drawcard.js');

class HighHallThrone extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.winsTiesForInitiative(),
                ability.effects.winsTiesForDominance()
            ]
        });
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: card => card.getType() === 'character' && card.hasTrait('House Arryn'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

HighHallThrone.code = '25606';
HighHallThrone.version = '1.0';

module.exports = HighHallThrone;
