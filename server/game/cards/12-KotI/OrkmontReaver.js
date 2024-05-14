const DrawCard = require('../../drawcard.js');

class OrkmontReaver extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getOpponents(this.controller)
                    .some((opponent) => opponent.discardPile.length >= 10),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
    }
}

OrkmontReaver.code = '12015';

module.exports = OrkmontReaver;
