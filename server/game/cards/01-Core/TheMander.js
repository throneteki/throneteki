const DrawCard = require('../../drawcard.js');

class TheMander extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5)
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2);
                this.game.addMessage('{0} kneels {1} to draw {2} {3}',
                    this.controller, this, cards, cards > 1 ? 'cards' : 'card');
            }
        });
    }
}

TheMander.code = '01193';

module.exports = TheMander;
