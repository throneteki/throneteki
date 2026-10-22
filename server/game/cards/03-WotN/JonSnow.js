import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JonSnow extends DrawCard {
    // Jon Snow (03005)
    // Action: Sacrifice a [stark] character to choose and stand a unique [stark] character. (Limit
    // once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            limit: ability.limit.perRound(1),
            cost: ability.costs.sacrifice(
                (card) => card.isFaction('stark') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    card.isUnique() &&
                    card.isFaction('stark') &&
                    card.getType() === 'character',
                gameAction: 'stand'
            },
            message: '{player} uses {source} and sacrifices {costs.sacrifice} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

JonSnow.code = '03005';

export default JonSnow;
