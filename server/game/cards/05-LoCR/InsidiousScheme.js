const DrawCard = require('../../drawcard.js');

class InsidiousScheme extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onClaimApplied: event => (
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5)
            },
            handler: context => {
                let opponent = context.event.challenge.loser;
                let cards = opponent.hand.size() === 0 ? 4 : 2;
                this.controller.drawCardsToHand(cards);
                this.game.addMessage('{0} plays {1} to draw {2} cards', this.controller, this, cards);
            }
        });
    }
}

InsidiousScheme.code = '05023';

module.exports = InsidiousScheme;
