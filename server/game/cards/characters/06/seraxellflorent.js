const DrawCard = require('../../../drawcard.js');

class SerAxellFlorent extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.attachments.size() === 0
            },
            handler: context => {
                context.target.controller.kneelCard(context.target);
                this.game.addMessage('{0} discards 1 gold from {1} to kneel {2}',
                                     this.controller, this, context.target);
            }
        });
    }
}

SerAxellFlorent.code = '06067';

module.exports = SerAxellFlorent;
