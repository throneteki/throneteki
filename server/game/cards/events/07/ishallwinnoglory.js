const DrawCard = require('../../../drawcard.js');

class IShallWinNoGlory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallenge: (event, challenge) => challenge.defendingPlayer === this.controller
            },
            title: () => 'Kneel Builders',
            cost: ability.costs.kneelMultiple(3, card => card.hasTrait('Builder') && card.getType() === 'character'),
            handler: (context) => {
                this.game.addMessage('{0} plays {1} and kneels {2} to end the challenge immediately with no winner or loser', 
                                      this.controller, this, context.kneelingCostCards);

                this.game.currentChallenge.cancelChallenge();
            }
        });
        this.reaction({
            when: {
                onChallenge: (event, challenge) => challenge.defendingPlayer === this.controller
            },
            title: () => 'Kneel Rangers',
            cost: ability.costs.kneelMultiple(3, card => card.hasTrait('Ranger') && card.getType() === 'character'),
            handler: (context) => {
                this.game.addMessage('{0} plays {1} and kneels {2} to end the challenge immediately with no winner or loser', 
                                      this.controller, this, context.kneelingCostCards);

                this.game.currentChallenge.cancelChallenge();
            }
        });
        this.reaction({
            when: {
                onChallenge: (event, challenge) => challenge.defendingPlayer === this.controller
            },
            title: () => 'Kneel Stewards',
            cost: ability.costs.kneelMultiple(3, card => card.hasTrait('Steward') && card.getType() === 'character'),
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
