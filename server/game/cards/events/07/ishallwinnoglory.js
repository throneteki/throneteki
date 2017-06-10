const DrawCard = require('../../../drawcard.js');

class IShallWinNoGlory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallenge: (event, challenge) => challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.choose({
                'Kneel Builders': ability.costs.kneelMultiple(3, card => card.hasTrait('Builder') && card.getType() === 'character'),
                'Kneel Rangers': ability.costs.kneelMultiple(3, card => card.hasTrait('Ranger') && card.getType() === 'character'),
                'Kneel Stewards': ability.costs.kneelMultiple(3, card => card.hasTrait('Steward') && card.getType() === 'character')
            }),
            handler: (context) => {
                this.game.addMessage('{0} plays {1} and kneels {2} to end the challenge immediately with no winner or loser', 
                                      this.controller, this, context.kneelingCostCards);

                this.game.currentChallenge.cancelChallenge();
            }
        });
    }
}

IShallWinNoGlory.code = '07024';

module.exports = IShallWinNoGlory;
