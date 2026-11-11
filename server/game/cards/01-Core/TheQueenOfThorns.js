import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheQueenOfThorns extends DrawCard {
    // The Queen of Thorns (01186)
    // Reaction: After you win an [intrigue] challenge in which The Queen of Thorns is
    // participating, put a [tyrell] character with printed cost 6 or lower into play from your
    // hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    event.challenge.challengeType === 'intrigue'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getPrintedCost() <= 6 &&
                    card.getType() === 'character' &&
                    card.isFaction('tyrell') &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} in play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

TheQueenOfThorns.code = '01186';

export default TheQueenOfThorns;
