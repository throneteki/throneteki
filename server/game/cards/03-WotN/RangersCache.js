import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class RangersCache extends PlotCard {
    // Ranger's Cache (03052)
    // Interrupt: When the taxation phase ends, either: draw 2 cards or gain 3 gold.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'taxation' &&
                    (context.source.controller.canGainGold() || context.source.controller.canDraw())
            },
            choices: {
                'Gain 3 gold': {
                    message: '{player} uses {source} to gain 3 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 3
                    }))
                },
                'Draw 2 cards': {
                    message: '{player} uses {source} to draw 2 cards',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 2
                    }))
                }
            }
        });
    }
}

RangersCache.code = '03052';

export default RangersCache;
