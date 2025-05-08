import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class GilbertOfTheVines extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top X cards of your deck',
            phase: 'challenge',
            cost: ability.costs.payXGold(
                () => 1,
                (context) => context.player.drawDeck.length
            ),
            message: {
                format: '{player} plays {source} to reveal the top {amount} cards of their deck',
                args: { amount: (context) => context.xValue }
            },
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: context.xValue,
                whileRevealed: GameActions.genericHandler((context) => {
                    const numRevealed = context.revealed.length;
                    if (numRevealed > 0) {
                        const numCards = Math.min(2, numRevealed);
                        this.game.promptForSelect(context.player, {
                            activePromptTitle: `Select up to ${numCards} cards`,
                            numCards,
                            cardCondition: (card) => context.revealed.includes(card),
                            onSelect: (player, cards) => {
                                cards = Array.isArray(cards) ? cards : [cards];
                                this.game.addMessage('{0} adds {1} to their hand', player, cards);
                                this.game.resolveGameAction(
                                    GameActions.simultaneously(() =>
                                        cards.map((card) => GameActions.addToHand({ card }))
                                    ),
                                    context
                                );
                                return true;
                            },
                            onCancel: (player) => {
                                this.game.addMessage(
                                    '{0} does not choose to add any cards to their hand',
                                    player
                                );
                                return true;
                            },
                            source: this
                        });
                    }
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
