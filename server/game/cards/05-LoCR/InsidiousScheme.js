import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class InsidiousScheme extends DrawCard {
    // Insidious Scheme (05023)
    // Reaction: After claim is applied for an [intrigue] challenge you won by 5 or more STR, draw 2
    // cards. (4 cards instead if the losing opponent has no cards in his or her hand.)
    setupCardAbilities() {
        this.reaction({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            handler: (context) => {
                let opponent = context.event.challenge.loser;
                let cards = opponent.getHandCount() === 0 ? 4 : 2;
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage(
                    '{0} plays {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

InsidiousScheme.code = '05023';

export default InsidiousScheme;
