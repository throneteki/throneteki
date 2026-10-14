import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MarketSquare extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to gain gold',
            phase: 'marshal',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message: '{player} kneels and sacrifices {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

MarketSquare.code = '00371';

export default MarketSquare;
