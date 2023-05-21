const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class ToGoForwardYouMustGoBack extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Shuffle hand',
            phase: 'dominance',
            message: '{player} plays {source} to allow each player to shuffle their hand into their deck and draw 5 cards',
            gameAction: GameActions.simultaneously(context => 
                context.game.getPlayersInFirstPlayerOrder().map(player =>
                    GameActions.may({
                        player,
                        title: 'Shuffle your hand and draw 5 cards?',
                        message: {
                            format: '{selectingPlayer} chooses to shuffle their hand into their deck and draw 5 cards',
                            args: { selectingPlayer: () => player },
                        },
                        gameAction: GameActions.shuffleIntoDeck({ cards: player.hand })
                            .then({
                                gameAction: GameActions.drawCards({ player, amount: 5, source: this })
                            })
                    })
                )
            )
        });
    }
}

ToGoForwardYouMustGoBack.code = '08114';

module.exports = ToGoForwardYouMustGoBack;
