const DrawCard = require('../../../drawcard.js');

class HighgardenMinstrel extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, player, card) => card.hasTrait('Song')
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
            }
        });
    }
}

HighgardenMinstrel.code = '06103';

module.exports = HighgardenMinstrel;
