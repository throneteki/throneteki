const DrawCard = require('../../drawcard.js');

class NaiveScout extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getPlayers().some((player) => player.shadows.length > 0),
            match: this,
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

NaiveScout.code = '11045';

module.exports = NaiveScout;
