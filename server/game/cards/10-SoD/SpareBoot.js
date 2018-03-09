const DrawCard = require('../../drawcard.js');

class SpareBoot extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and move attachment',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: card => card.location === 'play area' && card.getType() === 'attachment' &&
                                       card.parent && card.parent.controller === this.controller &&
                                       (card.parent !== this || card.kneeled) &&
                                       card.controller.canAttach(card, this)
            },
            handler: context => {
                if(context.target.parent !== this) {
                    context.player.attach(context.target.controller, context.target, this);
                }

                if(context.target.kneeled) {
                    context.player.standCard(context.target);
                }

                this.game.addMessage('{0} stands and moves {1} to {2}', context.player, context.target, this);
            }
        });
    }
}

SpareBoot.code = '10031';

module.exports = SpareBoot;
