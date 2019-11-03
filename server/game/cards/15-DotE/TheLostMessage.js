const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');
const Message = require('../../Message');
const TextHelper = require('../../TextHelper');
const {flatten} = require('../../../Array');

class TheLostMessage extends PlotCard {
    setupCardAbilities() {
        this.action({
            title: 'Shuffle cards into deck',
            message: '{player} uses {source} to have each player shuffle their hand into their deck',
            handler: context => {
                const players = this.game.getPlayers();
                const playerHandSizes = players.map(player => ({ player, amount: player.hand.length}));
                const fragments = playerHandSizes.map(handSize =>
                    Message.fragment('{player} adds {numCards} to hand', {
                        player: handSize.player,
                        numCards: TextHelper.count(handSize.amount, 'card')
                    })
                );

                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        players.map(
                            player => GameActions.shuffleIntoDeck({ cards: player.hand })
                        ),
                        context
                    ).then({
                        message: {
                            format: 'Then {fragments} for {source}',
                            args: { fragments: () => fragments }
                        },
                        handler: context => {
                            const topsCards = flatten(playerHandSizes.map(handSize => handSize.player.drawDeck.slice(0, handSize.amount)));

                            this.game.resolveGameAction(
                                GameActions.simultaneously(
                                    topsCards.map(card => GameActions.addToHand({ card }))
                                ),
                                context
                            );
                        }
                    }),
                    context
                );
            }
        });
    }
}

TheLostMessage.code = '15047';

module.exports = TheLostMessage;
