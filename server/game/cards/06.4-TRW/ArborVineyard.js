const DrawCard = require('../../drawcard.js');

class ArborVineyard extends DrawCard {
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

module.exports = ArborVineyard;
