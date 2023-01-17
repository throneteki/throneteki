const GameActions = require('../../GameActions');
const PlotCard = require('../../plotcard');

class ExchangeOfInformation extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message: '{player} uses {source} to choose an opponent and reveal the top 10 cards of their deck',
            handler: context => {
                this.selectedCards = [];
                this.game.resolveGameAction(
                    GameActions.revealTopCards({
                        player: this.controller,
                        amount: 10,
                        whileRevealed: GameActions.simultaneously(
                            ['character', 'location', 'attachment', 'event'].map(cardType => GameActions.ifCondition({
                                condition: context => context.revealed.some(card => card.getType() === cardType),
                                thenAction: GameActions.genericHandler(context => {
                                    let cardTypeText = ['attachment', 'event'].includes(cardType) ? `an ${cardType}` : `a ${cardType}`;
                                    this.game.promptForSelect(context.opponent, {
                                        activePromptTitle: `Select ${cardTypeText} for ${context.player.name}`,
                                        cardCondition: card => context.revealed.includes(card) && card.getType() === cardType,
                                        onSelect: (player, card) => {
                                            this.selectedCards.push(card);
                                            return true;
                                        },
                                        onCancel: (player) => {
                                            let text = ['attachment', 'event'].includes(cardType) ? `an ${cardType}` : `a ${cardType}`;
                                            this.game.addAlert('danger', '{0} does not select {1} card for {2} when one is available', player, text, this);
                                            return true;
                                        },
                                        source: this
                                    });
                                })
                            }))
                        )
                    }).then({
                        message: {
                            format: '{player} adds {selectedCards} chosen by {parentOpponent} to their hand',
                            args: {
                                selectedCards: () => this.selectedCards,
                                parentOpponent: context => context.parentContext.opponent
                            }
                        },
                        gameAction: GameActions.simultaneously(() => this.selectedCards.map(card => GameActions.addToHand({ card })))
                    }).then({
                        message: '{player} {gameAction}',
                        gameAction: GameActions.shuffle(context => ({ player: context.player }))
                    }),
                    context
                );
            }
        });
    }
}

ExchangeOfInformation.code = '11020';

module.exports = ExchangeOfInformation;
