import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GulltownMerchant extends DrawCard {
    // Gulltown Merchant (23030)
    // Marshaling Action: If there is a City plot card revealed, kneel Gulltown Merchant to gain 1
    // gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to gain 1 gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            condition: (context) => context.game.anyPlotHasTrait('City'),
            message: '{player} kneels {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

GulltownMerchant.code = '23030';

export default GulltownMerchant;
