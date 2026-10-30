import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowPolitics extends DrawCard {
    // Shadow Politics (13038)
    // Shadow (1).
    // Action: Choose one:
    // - Choose and discard 1 card from shadows.
    // - Choose up to 5 cards in a single discard pile and remove them from the game.
    // - Look at an opponent's hand.
    setupCardAbilities() {
        this.action({
            title: 'Choose an effect',
            choices: {
                'Discard a card from shadows': {
                    message: '{player} plays {source} to discard a card from shadows',
                    gameAction: GameActions.chooseCards({
                        title: 'Select a card in shadows to discard',
                        cardCondition: (card, context) =>
                            card.location === 'shadows' && card !== context.source,
                        gameAction: (card) => GameActions.discardCard({ card })
                    })
                },
                'Remove cards from a discard pile': {
                    message: '{player} plays {source} to remove cards from a discard pile',
                    gameAction: GameActions.chooseCards({
                        mode: 'upTo',
                        numCards: 5,
                        singleController: true,
                        title: 'Select up to 5 cards from a single discard pile',
                        cardCondition: (card) => card.location === 'discard pile',
                        gameAction: (card, context) =>
                            GameActions.removeFromGame({
                                card,
                                player: context.choosingPlayer
                            })
                    })
                },
                "Look at an opponent's hand": {
                    gameAction: GameActions.choose({
                        title: 'Select an opponent',
                        choices: (context) =>
                            Object.fromEntries(
                                context.game
                                    .getOpponents(context.player)
                                    .filter((opponent) => opponent.hand.length > 0)
                                    .map((opponent) => [
                                        opponent.name,
                                        {
                                            message: {
                                                format: "{player} plays {source} to look at {opponent}'s hand",
                                                args: { opponent: () => opponent }
                                            },
                                            gameAction: GameActions.lookAtHand(() => ({
                                                player: context.player,
                                                opponent,
                                                context
                                            }))
                                        }
                                    ])
                            )
                    })
                }
            }
        });
    }
}

ShadowPolitics.code = '13038';

export default ShadowPolitics;
