const DrawCard = require('../../../drawcard.js');

class ThrowingAxe extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => challenge.winner === this.controller && challenge.isAttacking(this.parent)
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isDefending(card),
                gameAction: 'kill'
            },
            handler: context => {
                context.target.controller.killCharacter(context.target);
                this.game.addMessage('{0} sacrifices {1} to kill {2}', this.controller, this, context.target);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('ironborn')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

ThrowingAxe.code = '01077';

module.exports = ThrowingAxe;
