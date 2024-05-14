const DrawCard = require('../../drawcard.js');

class DoreaSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card !== this &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= this.getNumberOfSandSnakes()
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }

    getNumberOfSandSnakes() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.hasTrait('Sand Snake') && card.getType() === 'character'
        );
    }
}

DoreaSand.code = '08016';

module.exports = DoreaSand;
