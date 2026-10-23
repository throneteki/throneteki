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
        // TODO: This should probably all be one action with multiple choices,
        // but the `choices` key does not support targeting per choice.
        this.action({
            title: 'Discard from shadows',
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'shadows' && card !== context.source
            },
            message: '{player} plays {source} to discard {target} from shadows',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
        this.action({
            title: 'Remove from game',
            target: {
                numCards: 5,
                activePromptTitle: 'Select up to 5 cards',
                singleController: true,
                cardCondition: (card) => card.location === 'discard pile'
            },
            message: '{player} plays {source} to remove {target} from the game',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) =>
                    GameActions.removeFromGame({ card, player: context.player })
                )
            )
        });
        this.action({
            title: 'Look at hand',
            chooseOpponent: (opponent) => opponent.hand.length > 0,
            message: "{player} plays {source} to look at {opponent}'s hand",
            gameAction: GameActions.lookAtHand((context) => ({
                player: context.player,
                opponent: context.opponent,
                context
            }))
        });
    }
}

ShadowPolitics.code = '13038';

export default ShadowPolitics;
