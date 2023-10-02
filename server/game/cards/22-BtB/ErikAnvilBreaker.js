const DrawCard = require('../../drawcard.js');

class ErikAnvilBreaker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'standing',
            match: this,
            effect: ability.effects.cannotBeStood()
        });
    }
}

ErikAnvilBreaker.code = '22004';

module.exports = ErikAnvilBreaker;
