const DrawCard = require('../../drawcard.js');

class Cohollo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardFromHand()
            ],
            condition: () => !!this.game.currentChallenge,
            handler: context => {
                this.game.currentChallenge.addParticipantToSide(context.player, this);

                this.game.addMessage('{0} kneels {1} to discard {2} and have {1} participate in the current challenge', context.player, this, context.costs.discardFromHand);
            }
        });
    }
}

Cohollo.code = '12035';

module.exports = Cohollo;
