const DrawCard = require('../../drawcard.js');

class TheHighSparrow extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [
                ability.effects.setMaxGoldGain(7),
                ability.effects.setMaxCardDraw(3)
            ]
        });
    }
}

TheHighSparrow.code = '08097';

module.exports = TheHighSparrow;
