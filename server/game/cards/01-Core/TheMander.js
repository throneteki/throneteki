const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class TheMander extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} kneels {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

TheMander.code = '01193';

module.exports = TheMander;
