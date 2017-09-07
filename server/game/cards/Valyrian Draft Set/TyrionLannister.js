const DrawCard = require('../../drawcard.js');

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller &&
                                         (event.challenge.challengeType === 'intrigue' || event.challenge.isParticipating(this))
            },
            cost: ability.costs.payGold(1),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} and pays 1 gold to draw 1 card', this.controller, this);
            }
        });
    }
}

TyrionLannister.code = '00011';

module.exports = TyrionLannister;
