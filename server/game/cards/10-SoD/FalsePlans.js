import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FalsePlans extends DrawCard {
    // False Plans (10023)
    // Challenges Action: Choose an opponent. That player discards 1 card at random from his or her
    // hand.
    // Reaction: After False Plans is discarded for [intrigue] claim, the winning opponent discards
    // 2 cards at random from his or her hand.
    setupCardAbilities() {
        this.action({
            phase: 'challenge',
            chooseOpponent: (opponent) => opponent.hand.length !== 0,
            message: '{player} plays {source} to have {opponent} discard 1 card at random',
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.opponent,
                amount: 1
            }))
        });
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.card === context.source &&
                    event.isClaim &&
                    !!context.game.currentChallenge &&
                    context.game.currentChallenge.winner !== context.player
            },
            ignoreEventCosts: true,
            location: 'discard pile',
            message: {
                format: '{player} uses {source} to have {opponent} discard 2 cards at random',
                args: { opponent: (context) => context.game.currentChallenge.winner }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.game.currentChallenge.winner,
                amount: 2
            }))
        });
    }
}

FalsePlans.code = '10023';

export default FalsePlans;
