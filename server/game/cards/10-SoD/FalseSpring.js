const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');
const TextHelper = require('../../TextHelper');

class FalseSpring extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to have each opponent choose 3 cards from their hand',
            gameAction: GameActions.simultaneously(context =>
                this.game.getOpponentsInFirstPlayerOrder(context.player)
                    .filter(player => player.hand.length > 0)
                    .map(player => GameActions.genericHandler(context => {
                        let numToReveal = Math.min(player.hand.length, 3);
                        this.game.promptForSelect(player, {
                            activePromptTitle: `Select ${TextHelper.count(numToReveal, 'card')}`,
                            source: this,
                            numCards: numToReveal,
                            multiSelect: true,
                            mode: 'exactly',
                            cardCondition: { location: 'hand', controller: player },
                            onSelect: (player, cards) => {
                                context.revealing = context.revealing || [];
                                context.revealing = context.revealing.concat(cards);
                                return true;
                            }
                        });
                    }))
            ).then({
                condition: context => !!context.parentContext.revealing,
                gameAction: GameActions.revealCards(context => ({
                    cards: context.parentContext.revealing,
                    whileRevealed: GameActions.genericHandler(context => {
                        const numOfRevealers = [...new Set(context.revealed.map(card => card.controller))].length;

                        this.game.promptForSelect(context.player, {
                            activePromptTitle: `Select up to 1 card${numOfRevealers > 1 ? ' from each hand' : ''}`,
                            mode: 'upTo',
                            source: this,
                            numCards: numOfRevealers,
                            context,
                            cardCondition: { condition: (card, context) => context.revealed.includes(card) && !context.selectedCards.some(selectedCard => selectedCard.controller !== card.controller) },
                            onSelect: (player, cards) => {
                                this.game.addMessage('{0} discards {1} from their owners hand', player, cards);
                                this.game.resolveGameAction(GameActions.simultaneously(() => cards.map(card => GameActions.discardCard({ card }))), context);
                                return true;
                            }
                        });
                    })
                }))
            })
        });
    }
}

FalseSpring.code = '10052';

module.exports = FalseSpring;
