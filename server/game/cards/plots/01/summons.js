const PlotCard = require('../../../plotcard.js');

class Summons extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card to add to your hand',
                    cardType: 'character',
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
    }
}

Summons.code = '01022';

module.exports = Summons;
