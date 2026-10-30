import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SparringInSecret extends DrawCard {
    // Sparring in Secret (08050)
    // Action: Kneel a Knight character to choose and stand another Knight character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Knight character',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Knight') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Knight') &&
                    card.getType() === 'character' &&
                    card.kneeled
            },
            message: '{player} plays {source} and kneels {costs.kneel} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

SparringInSecret.code = '08050';

export default SparringInSecret;
