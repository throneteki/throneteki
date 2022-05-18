const DrawCard = require('../../drawcard.js');

class ShadowOfTheRose extends DrawCard {
    setupCardAbilities() {
        this.action({
            message: '{player} plays {source} to search the top 10 cards of their deck for a card with shadow',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card with shadow',
                    cardCondition: card => card.isShadow(),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            player.putIntoShadows(card);
            this.game.addMessage('{0} puts {1} into shadows',
                player, card);
            this.returnToHandInsteadOfDiscardPile(player);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not put any card into shadows',
            player);
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
