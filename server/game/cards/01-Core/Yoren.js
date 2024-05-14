const DrawCard = require('../../drawcard.js');

class Yoren extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.owner !== this.controller &&
                    card.getPrintedCost() <= 3 &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    "{0} uses {1} to put {2} into play from {3}'s discard pile under their control",
                    this.controller,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

Yoren.code = '01129';

module.exports = Yoren;
