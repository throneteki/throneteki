import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CalledIntoService extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.event.cards[0].getType() === 'character',
                    thenAction: GameActions.ifCondition({
                        condition: (context) => context.parentContext.revealed.length > 0,
                        thenAction: GameActions.putIntoPlay((context) => ({
                            card: context.parentContext.revealed[0]
                        }))
                    }),
                    elseAction: GameActions.simultaneously((context) => [
                        GameActions.drawSpecific((context) => ({
                            player: context.player,
                            cards: context.parentContext.revealed
                        })),
                        GameActions.gainGold({ player: context.player, amount: 2 })
                    ])
                })
            })
        });
    }
}

CalledIntoService.code = '07049';

export default CalledIntoService;
