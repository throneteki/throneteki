import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Shae extends DrawCard {
    // Shae (04029)
    // Challenges Action: Pay 1 gold to stand Shae. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Shae',
            phase: 'challenge',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

Shae.code = '04029';

export default Shae;
