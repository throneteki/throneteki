const DrawCard = require('../../drawcard.js');

class PalaceSpearman extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentPhase !== 'setup' &&
                this.game.currentPhase !== 'plot' &&
                !this.controller.firstPlayer,
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

PalaceSpearman.code = '01114';

module.exports = PalaceSpearman;
