import DrawCard from '../../drawcard.js';

class HandMaiden extends DrawCard {
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
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} sacrifices {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

HandMaiden.code = '01169';

export default HandMaiden;
