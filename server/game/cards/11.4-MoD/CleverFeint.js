const DrawCard = require('../../drawcard.js');

class CleverFeint extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return cards to shadows',
            cost: ability.costs.kneelFactionCard(),
            target: {
                mode: 'unlimited',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller &&
                                       card.isShadow()
            },
            handler: context => {
                for(let card of context.target) {
                    card.controller.moveCard(card, 'shadows');
                }

                this.game.addMessage('{0} plays {1} to return {2} to shadows', context.player, this, context.target);
            }
        });
    }
}

CleverFeint.code = '11070';

module.exports = CleverFeint;
