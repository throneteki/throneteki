const DrawCard = require('../../../drawcard.js');

class Dissension extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard Ally from play',
            phase: 'marshal',
            target: {
                activePromptTitle: 'Select an Ally',
                cardCondition: card => card.hasTrait('Ally') && card.getType() === 'character'
            },
            handler: context => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage('{0} plays {1} to discard {2}',
                    this.controller, this, context.target);
            }
        });
    }
}

Dissension.code = '04059';

module.exports = Dissension;
