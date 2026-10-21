import DrawCard from '../../drawcard.js';

class TheQueenOfThorns extends DrawCard {
    // The Queen of Thorns (01186)
    // Reaction: After you win an [intrigue] challenge in which The Queen of Thorns is
    // participating, put a [tyrell] character with printed cost 6 or lower into play from your
    // hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    event.challenge.challengeType === 'intrigue'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getPrintedCost() <= 6 &&
                    card.getType() === 'character' &&
                    card.isFaction('tyrell') &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to put {2} in play from their hand',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

TheQueenOfThorns.code = '01186';

export default TheQueenOfThorns;
