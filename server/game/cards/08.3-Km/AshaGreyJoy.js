const DrawCard = require('../../drawcard.js');

class AshaGreyjoy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPillage: event => event.source === this && event.challenge.loser.discardPile.size() >= 1
            },
            handler: context => {
                let amount = context.event.challenge.loser.discardPile.size();

                this.game.promptForDeckSearch(this.controller, {
                    numCards: amount,
                    activePromptTitle: 'Select a card',
                    onSelect: (player, card) => this.cardSelected(player, card, amount),
                    onCancel: player => this.doneSelecting(player, amount),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, amount) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search the top {2} cards of their deck and add 1 to their hand',
            player, this, amount);
    }

    doneSelecting(player, amount) {
        this.game.addMessage('{0} uses {1} to search the top {2} cards of their deck, but does not add any card to their hand',
            player, this, amount);
    }
}

AshaGreyjoy.code = '08051';

module.exports = AshaGreyjoy;
