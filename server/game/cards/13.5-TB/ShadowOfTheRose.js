const DrawCard = require('../../drawcard.js');

class ShadowOfTheRose extends DrawCard {
    setupCardAbilities() {
        this.action({
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card with shadow',
                    cardCondition: card => card.isShadow(),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.putIntoShadows(card);
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into shadows',
            player, this, card);
        this.returnToHandInsteadOfDiscardPile(player);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into shadows',
            player, this);
        this.returnToHandInsteadOfDiscardPile(player);
    }

    returnToHandInsteadOfDiscardPile(player) {
        if(this.game.anyPlotHasTrait('Summer')) {
            this.game.addMessage('{0} uses {1} to return {1} to their hand instead of their discard pile', player, this);
            player.moveCard(this, 'hand');
        }
    }
}

ShadowOfTheRose.code = '13084';

module.exports = ShadowOfTheRose;
