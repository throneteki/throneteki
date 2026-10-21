import DrawCard from '../../drawcard.js';

class ArborVineyard extends DrawCard {
    // Arbor Vineyard (06064)
    // Limited.
    // Marshaling Action: Kneel Arbor Vineyard to gain 1 gold. (2 gold instead if there are more
    // Summer plot cards than Winter plot cards revealed.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let gold = this.moreSummerThanWinterPlotsRevealed() ? 2 : 1;
                this.game.addGold(context.player, gold);
                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
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
