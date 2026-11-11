import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JeyneWesterling extends DrawCard {
    // Jeyne Westerling (05033)
    // Action: Kneel Jeyne Westerling to choose and stand a [stark] King or Lord character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a King or Lord',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('stark') &&
                    card.getType() === 'character' &&
                    (card.hasTrait('King') || card.hasTrait('Lord')) &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

JeyneWesterling.code = '05033';

export default JeyneWesterling;
