import DrawCard from '../../drawcard.js';

class Sellsails extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Mercenary or Raider',
            cost: ability.costs.discardGold(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    (card.hasTrait('Mercenary') || card.hasTrait('Raider')),
                gameAction: 'stand'
            },
            message: '{player} discards 1 gold from {source} to stand {target}',
            handler: (context) => {
                context.target.controller.standCard(context.target);
            }
        });
    }
}

Sellsails.code = '00122';

export default Sellsails;
