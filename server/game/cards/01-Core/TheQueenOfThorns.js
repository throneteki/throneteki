import DrawCard from '../../drawcard.js';

class TheQueenOfThorns extends DrawCard {
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
