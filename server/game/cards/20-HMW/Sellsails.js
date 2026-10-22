import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Sellsails extends DrawCard {
    // Sellsails (20002)
    // Bestow (2).
    // Action: Discard 1 gold from Sellsails to choose and stand a Smuggler or Warship card. (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Smuggler or Warship',
            cost: ability.costs.discardGold(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    (card.hasTrait('Smuggler') || card.hasTrait('Warship')),
                gameAction: 'stand'
            },
            message: '{player} discards 1 gold from {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

Sellsails.code = '20002';

export default Sellsails;
