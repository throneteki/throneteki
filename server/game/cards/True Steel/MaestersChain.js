const DrawCard = require('../../../drawcard.js');

class MaestersChain extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard condition attachment',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: card => card.location === 'play area' && card.getType() === 'attachment' && card.hasTrait('condition')
            },
            handler: context => {
                context.target.owner.discardCard(context.target);
                this.game.addMessage('{0} kneels {1} to discard {2}', this.controller, this, context.target);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('maester')) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

MaestersChain.code = '02117';

module.exports = MaestersChain;
