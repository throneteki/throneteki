const DrawCard = require('../../drawcard.js');

class NorthernKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let gold = this.moreWinterThanSummerPlotsRevealed() ? 2 : 1;
                gold = this.game.addGold(context.player, gold);

                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }

    moreWinterThanSummerPlotsRevealed() {
        let winterPlots = this.game.getNumberOfPlotsWithTrait('Winter');
        let summerPlots = this.game.getNumberOfPlotsWithTrait('Summer');

        return winterPlots > summerPlots;
    }
}

NorthernKeep.code = '06102';

module.exports = NorthernKeep;
