const DrawCard = require('../../../drawcard.js');

class RaidingTheBayOfIce extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.attackingPlayer === this.controller
            },
            cost: ability.costs.kneel(card => card.hasTrait('Warship') && card.getType() === 'location'),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: card => (
                    card.location === 'play area' &&
                    !card.isLimited() && 
                    card.getType() === 'location' && 
                    card.controller !== this.controller)
            },
            handler: context => {
                context.target.owner.moveCard(context.target, 'draw deck');
                this.game.addMessage('{0} plays {1} to move {2} to the top of {3}\'s deck',
                                      this.controller, this, context.target, context.target.owner);

            }
        });
    }
}

RaidingTheBayOfIce.code = '07028';

module.exports = RaidingTheBayOfIce;
