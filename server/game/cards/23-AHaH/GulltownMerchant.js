const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class GulltownMerchant extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to gain 1 gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            condition: context => context.game.anyPlotHasTrait('City'),
            message: '{player} kneels {source} to gain 1 gold',
            gameAction: GameActions.gainGold(context => ({ player: context.player, amount: 1 }))
        });
    }
}

GulltownMerchant.code = '23030';

module.exports = GulltownMerchant;
