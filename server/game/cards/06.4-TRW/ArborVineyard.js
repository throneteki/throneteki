import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArborVineyard extends DrawCard {
    // Arbor Vineyard (06064)
    // Limited.
    // Marshaling Action: Kneel Arbor Vineyard to gain 1 gold. (2 gold instead if there are more
    // Summer plot cards than Winter plot cards revealed.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {gold} gold',
                args: {
                    gold: (context) => (context.source.moreSummerThanWinterPlotsRevealed() ? 2 : 1)
                }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.source.moreSummerThanWinterPlotsRevealed() ? 2 : 1
            }))
        });
    }

    moreSummerThanWinterPlotsRevealed() {
        let summerPlots = this.game.getNumberOfPlotsWithTrait('Summer');
        let winterPlots = this.game.getNumberOfPlotsWithTrait('Winter');

        return summerPlots > winterPlots;
    }
}

ArborVineyard.code = '06064';

export default ArborVineyard;
