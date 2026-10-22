import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheGoldroad extends DrawCard {
    // The Goldroad (06110)
    // Limited.
    // Challenges Action: Kneel The Goldroad to gain 1 gold.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Gain 1 gold',
            phase: 'challenge',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

TheGoldroad.code = '06110';

export default TheGoldroad;
