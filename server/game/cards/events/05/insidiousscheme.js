const DrawCard = require('../../../drawcard.js');

class InsidiousScheme extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onClaimApplied: (event, challenge) => (
                    challenge.challengeType === 'intrigue' &&
                    challenge.winner === this.controller &&
                    challenge.strengthDifference >= 5)
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                let cards = opponent && opponent.hand.size() === 0 ? 4 : 2;
                this.controller.drawCardsToHand(cards);
                this.game.addMessage('{0} plays {1} to draw {2} cards', this.controller, this, cards);
            }
        });
    }
}

InsidiousScheme.code = '05023';

module.exports = InsidiousScheme;
