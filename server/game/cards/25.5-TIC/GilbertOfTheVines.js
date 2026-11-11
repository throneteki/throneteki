import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class GilbertOfTheVines extends DrawCard {
    // Gilbert of the Vines (25096)
    // Challenges Action: Reveal the top X cards of your deck. Choose up to 2 cards revealed this
    // way and add them to your hand. Shuffle the other cards back into your deck.
    setupCardAbilities() {
        this.xValue({ min: () => 1, max: (context) => context.player.drawDeck.length });
        this.action({
            title: 'Reveal top X cards of your deck',
            phase: 'challenge',
            message: {
                format: '{player} plays {source} to reveal the top {amount} cards of their deck',
                args: { amount: (context) => context.xValue }
            },
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: context.xValue,
                whileRevealed: GameActions.chooseCards({
                    mode: 'upTo',
                    numCards: 2,
                    optional: true,
                    title: 'Select up to 2 cards',
                    cardCondition: (card, context) => context.revealed.includes(card),
                    gameAction: (card) => GameActions.addToHand({ card })
                })
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.shuffle((context) => ({ player: context.player }))
            })
        });
    }
}

GilbertOfTheVines.code = '25096';

export default GilbertOfTheVines;
