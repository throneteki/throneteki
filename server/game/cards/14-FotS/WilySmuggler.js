const DrawCard = require('../../drawcard');

class WilySmuggler extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place card on top of deck',
            target: {
                type: 'select',
                activePromptTitle: 'Select a card',
                cardCondition: card => card.location === 'hand' && card.controller === this.controller
            },
            message: '{player} uses {source} to place a card on top of their deck',
            handler: context => {
                context.player.moveCardToTopOfDeck(context.target);

                this.game.once('onAtEndOfPhase', () => {
                    if(!context.player.canDraw()) {
                        return;
                    }

                    this.game.addMessage('Then {0} draws 1 card for {1}', context.player, this);
                    context.player.drawCardsToHand(1);
                });
            },
            limit: ability.limit.perRound(1)
        });
    }
}

WilySmuggler.code = '14016';

module.exports = WilySmuggler;
