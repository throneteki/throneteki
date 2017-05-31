const DrawCard = require('../../../drawcard.js');

class SerHorasRedwyne extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (e, player, card) => card === this
            },
            target: {
                activePromptTitle: 'Select a Lady',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Lady')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to stand {2}', context.player, this, context.target);
                this.controller.standCard(context.target);
            }
        });
    }
}

SerHorasRedwyne.code = '02063';

module.exports = SerHorasRedwyne;
