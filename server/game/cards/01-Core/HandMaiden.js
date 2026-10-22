import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HandMaiden extends DrawCard {
    // Handmaiden (01169)
    // Action: Sacrifice Handmaiden to choose and stand a Lady character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a Lady',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Lady')
            },
            message: '{player} sacrifices {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

HandMaiden.code = '01169';

export default HandMaiden;
