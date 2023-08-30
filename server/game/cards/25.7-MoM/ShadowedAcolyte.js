const DrawCard = require('../../drawcard.js');

class ShadowedAcolyte extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getOpponents(this.controller).some(opponent => opponent.shadows.length > 0),
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
    }
}

ShadowedAcolyte.code = '25506';
ShadowedAcolyte.version = '1.0';

module.exports = ShadowedAcolyte;
