import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class RangersCache extends PlotCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'taxation' &&
                    (this.controller.canGainGold() || this.controller.canDraw())
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
