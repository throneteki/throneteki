const DrawCard = require('../../drawcard.js');

class IronEmmett extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.kneeled && this.game.currentPhase === 'challenge',
            effect: [
                ability.effects.cannotPutIntoPlay(card => card.hasIcon('military')),
                ability.effects.cannotPlay(card => card.hasIcon('military'))
            ]
        });
    }
}

IronEmmett.code = '24013';

module.exports = IronEmmett;
