const DrawCard = require('../../../drawcard.js');

class SpearsOfTheMerlingKing extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => {
                    if(event.card.controller === this.controller) {
                        this.returnCard = event.card;
                        return true;
                    }
                    return false;
                }
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                context.skipHandler();
                this.controller.moveCard(this, 'hand');
                this.game.addMessage('{0} sacrifices {1} to return {2} to their hand', 
                                      this.controller, this, this.returnCard);
            }
        });
    }
}

SpearsOfTheMerlingKing.code = '06048';

module.exports = SpearsOfTheMerlingKing;
