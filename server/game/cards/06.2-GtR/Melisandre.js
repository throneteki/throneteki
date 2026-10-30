import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Melisandre extends DrawCard {
    // Melisandre (06027)
    // Insight.
    // Reaction: After you win dominance, choose an opponent and look at his or her hand. Then,
    // choose and discard 1 card from that hand. If that card is a character, place it in its
    // owner's dead pile.
    setupCardAbilities() {
        this.reaction({
            when: { onDominanceDetermined: (event, context) => event.winner === context.player },
            chooseOpponent: (opponent) => opponent.hand.length > 0,
            message: "{player} uses {source} to look at {opponent}'s hand",
            gameAction: GameActions.lookAtHand((context) => ({
                player: context.player,
                opponent: context.opponent
            })).then({
                target: {
                    revealTargets: true,
                    cardCondition: (card, context) =>
                        card.location === 'hand' &&
                        card.controller === context.parentContext.opponent
                },
                message: '{player} then uses {source} to discard {target}',
                gameAction: GameActions.discardCard((context) => ({
                    card: context.target,
                    destination:
                        context.target.getType() === 'character' ? 'dead pile' : 'discard pile'
                }))
            })
        });
    }
}

Melisandre.code = '06027';

export default Melisandre;
