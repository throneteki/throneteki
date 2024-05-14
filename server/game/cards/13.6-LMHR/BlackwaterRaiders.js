const DrawCard = require('../../drawcard');

class BlackwaterRaiders extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.getType() === 'location' &&
                    card.location === 'discard pile' &&
                    this.controller.canPutIntoPlay(card) &&
                    card.controller !== this.controller &&
                    card.getPrintedCost() <= 2
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    "{0} uses {1} to put {2} into play from {3}'s discard pile ",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

BlackwaterRaiders.code = '13111';

module.exports = BlackwaterRaiders;
