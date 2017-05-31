const DrawCard = require('../../../drawcard.js');

class SpearsOfTheMerlingKing extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.controller === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                context.skipHandler();
                this.controller.moveCard(context.event.card, 'hand');
                this.game.addMessage('{0} sacrifices {1} to return {2} to their hand', 
                                      this.controller, this, context.event.card);
            }
        });
    }
}

SpearsOfTheMerlingKing.code = '06048';

module.exports = SpearsOfTheMerlingKing;
