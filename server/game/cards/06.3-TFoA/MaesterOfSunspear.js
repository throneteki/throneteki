const DrawCard = require('../../drawcard.js');

class MaesterOfSunspear extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => this.controller === event.challenge.loser && event.challenge.isParticipating(this)
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: card => card.location === 'play area' && card.getType() === 'attachment'
            },
            handler: context => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage('{0} uses {1} to return {2} to its owner\'s hand',
                    this.controller, this, context.target);
            }
        });
    }
}

MaesterOfSunspear.code = '06055';

module.exports = MaesterOfSunspear;
