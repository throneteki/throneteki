import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Tithe extends DrawCard {
    // Tithe (03045)
    // Action: Kneel a neutral character to gain 2 gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel character to gain 2 gold',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneel(
                (card) => card.isFaction('neutral') && card.getType() === 'character'
            ),
            message: '{player} uses {source} to kneel {costs.kneel} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

Tithe.code = '03045';

export default Tithe;
