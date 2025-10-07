import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class InsidiousScheme extends DrawCard {
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
