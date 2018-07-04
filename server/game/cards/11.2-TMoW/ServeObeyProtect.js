const DrawCard = require('../../drawcard.js');

class ServeObeyProtect extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.defendingPlayer === this.controller &&
                                               this.controller.getNumberOfChallengesLost('defender') >= 1
            },
            cost: ability.costs.returnToHand(card => card.isFaction('martell') && card.getType() === 'character'),
            target: {
                cardCondition: (card, context) => card.location === 'hand' && card.controller === this.controller &&
                                                  card.isFaction('martell') && card.getType() === 'character' &&
                                                  card.getPrintedCost() <= 5 && 
                                                  (!context.costs.returnToHand || card !== context.costs.returnToHand)
                                       
            },
            handler: context => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage('{0} plays {1} and returns {2} to their hand to put {3} into play',
                    context.player, this, context.costs.returnToHand, context.target);
            }
        });
    }
}

ServeObeyProtect.code = '11036';

module.exports = ServeObeyProtect;
