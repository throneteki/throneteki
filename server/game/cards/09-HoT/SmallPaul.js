const DrawCard = require('../../drawcard.js');

class SmallPaul extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            handler: () => {
                let reserve = this.controller.getTotalReserve();
                this.game.promptForDeckSearch(this.controller, {
                    numCards: reserve,
                    numToSelect: reserve,
                    activePromptTitle: 'Select any number of Stewards',
                    cardCondition: card => card.hasTrait('Steward') && card.getType() === 'character',
                    onSelect: (player, card) => this.selectCards(player, card),
                    onCancel: player => this.cancelSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCards(player, cards) {
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, cards);
        for(let card of cards) {
            player.moveCard(card, 'hand');
        }
    }

    cancelSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any cards', player, this);
    }
}

SmallPaul.code = '09033';

module.exports = SmallPaul;
