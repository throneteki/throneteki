const DrawCard = require('../../../drawcard.js');

class GhastonGrey extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && 
                                                      challenge.defendingPlayer === this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && 
                                       this.game.currentChallenge.isAttacking(card)
            },
            handler: context => {
                context.target.owner.returnCardToHand(context.target, false);
                this.game.addMessage('{0} kneels and sacrifices {1} to return {2} to {3}\'s hand',
                                      context.player, this, context.target, context.target.owner);
            }
        });
    }
}

GhastonGrey.code = '01116';

module.exports = GhastonGrey;
