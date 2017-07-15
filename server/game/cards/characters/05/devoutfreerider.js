const DrawCard = require('../../../drawcard.js');

class DevoutFreerider extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.cannotGainGold()
        });
    }
}

DevoutFreerider.code = '05040';

module.exports = DevoutFreerider;
