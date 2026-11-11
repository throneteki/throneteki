import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WithoutHisBeard extends DrawCard {
    // Without His Beard (04070)
    // Reaction: After you win an [intrigue] challenge, discard up to 3 cards at random from the
    // losing opponent's hand. Then, that player draws 2 cards.
    setupCardAbilities() {
        const discardThenDraw = (amount) =>
            GameActions.discardAtRandom((context) => ({
                player: context.event.challenge.loser,
                amount
            })).then({
                gameAction: GameActions.drawCards((context) => ({
                    player: context.parentContext.event.challenge.loser,
                    amount: 2
                }))
            });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue'
            },
            gameAction: GameActions.choose({
                title: 'Select # of cards to discard',
                choices: {
                    1: {
                        message: {
                            format: '{player} plays {source} to have {loser} discard 1 card at random, then draw 2 cards',
                            args: { loser: (context) => context.event.challenge.loser }
                        },
                        gameAction: discardThenDraw(1)
                    },
                    2: {
                        message: {
                            format: '{player} plays {source} to have {loser} discard 2 cards at random, then draw 2 cards',
                            args: { loser: (context) => context.event.challenge.loser }
                        },
                        gameAction: discardThenDraw(2)
                    },
                    3: {
                        message: {
                            format: '{player} plays {source} to have {loser} discard 3 cards at random, then draw 2 cards',
                            args: { loser: (context) => context.event.challenge.loser }
                        },
                        gameAction: discardThenDraw(3)
                    }
                }
            })
        });
    }
}

WithoutHisBeard.code = '04070';

export default WithoutHisBeard;
