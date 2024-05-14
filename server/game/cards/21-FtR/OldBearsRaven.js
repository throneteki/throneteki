const DrawCard = require('../../drawcard.js');

class OldBearsRaven extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Old Bear',
            cost: ability.costs.returnSelfToHand(),
            max: ability.limit.perRound(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.name === 'Old Bear Mormont' &&
                    card.kneeled,
                gameAction: 'stand'
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} returns {1} back to hand to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

OldBearsRaven.code = '21014';

module.exports = OldBearsRaven;
