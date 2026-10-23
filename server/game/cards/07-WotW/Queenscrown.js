import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Queenscrown extends DrawCard {
    // Queenscrown (07019)
    // Action: Kneel Queenscrown to reveal the top 3 cards of an opponent's deck. Choose up to 1
    // character revealed this way and place it in that player's discard pile. Place the other cards
    // on the bottom of that player's deck in any order.
    setupCardAbilities(ability) {
        this.action({
            title: "Reveal top 3 cards of opponent's deck",
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            message: "{player} kneels {costs.kneel} to reveal the top 3 cards of {opponent}'s deck",
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.opponent,
                amount: 3,
                whileRevealed: GameActions.chooseCards({
                    mode: 'upTo',
                    numCards: 1,
                    optional: true,
                    title: 'Select a character',
                    cardCondition: (card, context) =>
                        context.revealed.includes(card) && card.getType() === 'character',
                    gameAction: (card, context) =>
                        GameActions.placeCard({
                            card,
                            location: 'discard pile',
                            player: context.player
                        })
                })
            })).then({
                message: {
                    format: "Then {player} places the other cards on the bottom of {opponent}'s deck, in any order",
                    args: { opponent: (context) => context.parentContext.opponent }
                },
                gameAction: GameActions.simultaneously((context) =>
                    context.parentContext.revealed
                        .filter((card) => card.location === 'draw deck')
                        .map((card) =>
                            GameActions.placeCard({
                                card,
                                location: 'draw deck',
                                bottom: true,
                                player: context.player
                            })
                        )
                )
            })
        });
    }
}

Queenscrown.code = '07019';

export default Queenscrown;
