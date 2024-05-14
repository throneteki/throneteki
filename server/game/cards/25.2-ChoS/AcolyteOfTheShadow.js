const DrawCard = require('../../drawcard.js');

class AcolyteOfTheShadow extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getOpponents(this.controller)
                    .some((opponent) => opponent.shadows.length > 0),
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
    }
}

AcolyteOfTheShadow.code = '25021';

module.exports = AcolyteOfTheShadow;
