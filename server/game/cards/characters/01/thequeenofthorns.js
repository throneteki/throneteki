const DrawCard = require('../../../drawcard.js');

class TheQueenOfThorns extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this) && challenge.challengeType === 'intrigue'
            },
            target: {
                activePromptTitle: 'Select a character to put into play',
                cardCondition: card => card.location === 'hand' && card.controller === this.controller &&
                                       card.getPrintedCost() <= 6 && card.getType() === 'character' && card.isFaction('tyrell')
            },
            handler: context => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage('{0} uses {1} to put {2} in play from their hand', this.controller, this, context.target);
            }
        });
    }
}

TheQueenOfThorns.code = '01186';

module.exports = TheQueenOfThorns;
