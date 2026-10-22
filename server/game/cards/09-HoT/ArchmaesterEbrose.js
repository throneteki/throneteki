import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArchmaesterEbrose extends DrawCard {
    // Archmaester Ebrose (09039)
    // Action: Kneel a Maester character to choose and stand another Maester character. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Maester character',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Maester') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Maester') &&
                    card.getType() === 'character' &&
                    card.kneeled
            },
            message: '{player} uses {source} and kneels {costs.kneel} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

ArchmaesterEbrose.code = '09039';

export default ArchmaesterEbrose;
