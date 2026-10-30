import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';
import TextHelper from '../../TextHelper.js';

class FalseSpring extends PlotCard {
    // False Spring (10052)
    // When Revealed: Each opponent chooses and reveals 3 cards from his or her hand, if able. You
    // may choose and discard 1 revealed card from any number of those hands.
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to have each opponent choose 3 cards from their hand',
            gameAction: GameActions.chooseCards({
                players: (context) => context.game.getOpponentsInFirstPlayerOrder(context.player),
                mode: 'exactly',
                numCards: 3,
                title: (context) =>
                    `Select ${TextHelper.count(Math.min(3, context.choosingPlayer.hand.length), 'card')}`,
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.choosingPlayer,
                gameAction: (card) =>
                    GameActions.revealCards({ cards: [card], player: card.controller })
            }).then({
                gameAction: GameActions.simultaneously((context) =>
                    context.game.getOpponentsInFirstPlayerOrder(context.player).map((opponent) =>
                        GameActions.chooseCards({
                            optional: true,
                            title: `Select up to 1 card from ${opponent.name}'s hand`,
                            cardCondition: (card, context) =>
                                context.parentContext.chosenCards.includes(card) &&
                                card.controller === opponent &&
                                card.location === 'hand',
                            gameAction: (card) => GameActions.discardCard({ card })
                        })
                    )
                )
            })
        });
    }
}

FalseSpring.code = '10052';

export default FalseSpring;
