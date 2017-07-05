const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ArborVineyard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let gold = this.moreSummerThanWinterPlotsRevealed() ? 2 : 1;
                this.game.addGold(context.player, gold);
                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }

    moreSummerThanWinterPlotsRevealed() {
        let summerPlots = _.filter(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Summer'));
        let winterPlots = _.filter(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Winter'));

        return summerPlots.length > winterPlots.length;
    }
}

ArborVineyard.code = '06064';

module.exports = ArborVineyard;
