import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Irri extends DrawCard {
    // Irri (06093)
    // Bestow (2).
    // Action: Discard 1 gold from Irri to choose and stand a Lord or Lady character. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Lord or Lady',
            cost: ability.costs.discardGold(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} discards 1 gold from {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

Irri.code = '06093';

export default Irri;
