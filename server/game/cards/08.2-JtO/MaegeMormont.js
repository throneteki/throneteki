const DrawCard = require('../../drawcard.js');

class MaegeMormont extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.hasParticipatingMormont(event.challenge)
            },
            handler: context => {
                let topCard = this.controller.drawDeck.first();
                let message = '{0} uses {1} to reveal {2} as the top card of their deck';

                if(topCard.isFaction('stark')) {
                    this.controller.drawCardsToHand(1);
                    message += ' and draw it';
                }

                this.game.addMessage(message, context.player, this, topCard);
            }
        });
    }

    hasParticipatingMormont(challenge) {
        return this.controller.anyCardsInPlay(card => challenge.isParticipating(card) && card.hasTrait('House Mormont'));
    }
}

MaegeMormont.code = '08021';

module.exports = MaegeMormont;
