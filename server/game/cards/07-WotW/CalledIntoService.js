const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class CalledIntoService extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards(context => ({
                player: context.player
            })).then({
                message: '{player} {gameAction}',
                gameAction:GameActions.ifCondition({
                    condition: context => context.event.cards[0].getType() === 'character',
                    thenAction: GameActions.putIntoPlay(context => ({ card: context.event.cards[0] })),
                    elseAction: GameActions.simultaneously(context => [
                        GameActions.drawCards({ player: context.player, amount: 1 }),
                        GameActions.gainGold({ player: context.player, amount: 2 })
                    ])
                })
            })
        });
    }
}

CalledIntoService.code = '07049';

module.exports = CalledIntoService;
