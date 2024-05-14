const DrawCard = require('../../drawcard.js');

class Cohollo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            condition: () => !!this.game.currentChallenge,
            message: {
                format: '{player} kneels {source} and discards {discardCost} to have {source} participate in the current challenge',
                args: {
                    discardCost: (context) => context.costs.discardFromHand
                }
            },
            handler: (context) => {
                this.game.currentChallenge.addParticipantToSide(context.player, this);
            }
        });
    }
}

Cohollo.code = '12035';

module.exports = Cohollo;
