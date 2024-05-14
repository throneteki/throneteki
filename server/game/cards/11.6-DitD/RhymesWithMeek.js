const DrawCard = require('../../drawcard');
const TextHelper = require('../../TextHelper');

class RhymesWithMeek extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, unopposed: true })
            },
            handler: (context) => {
                let amount = context.cardStateWhenInitiated.location === 'shadows' ? 3 : 2;
                let numCardsDrawn = context.player.drawCardsToHand(amount).length;
                this.game.addMessage(
                    '{0} plays {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numCardsDrawn, 'card')
                );
            }
        });
    }
}

RhymesWithMeek.code = '11112';

module.exports = RhymesWithMeek;
