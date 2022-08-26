const DrawCard = require('../../drawcard');

class TheBloodyGate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: () => !this.kneeled,
            effect: ability.effects.increaseCost({
                playingTypes: ['play', 'ambush', 'outOfShadows'],
                amount: 1
            })
        });
    }
}

TheBloodyGate.code = '23032';

module.exports = TheBloodyGate;
