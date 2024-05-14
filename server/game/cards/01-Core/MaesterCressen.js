const DrawCard = require('../../drawcard.js');

class MaesterCressen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to discard condition',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.hasTrait('condition')
            },
            handler: (context) => {
                this.controller.discardCard(context.target);

                this.game.addMessage(
                    '{0} uses {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

MaesterCressen.code = '01046';

module.exports = MaesterCressen;
