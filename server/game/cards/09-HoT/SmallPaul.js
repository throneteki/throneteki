const DrawCard = require('../../drawcard.js');

class SmallPaul extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            handler: () => {
                this.selectedCards = [];
                let reserve = this.controller.getTotalReserve();
                this.game.promptForDeckSearch(this.controller, {
                    numCards: reserve,
                    numToSelect: reserve,
                    activePromptTitle: 'Select any number of Stewards',
                    cardCondition: card => card.hasTrait('Steward') && card.getType() === 'character',
                    onSelect: (player, card) => this.selectCard(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCard(player, card) {
        this.selectedCards.push(card);
        player.removeCardFromPile(card);
        return true;
    }

    doneSelecting(player) {
        if(this.selectedCards.length === 0) {
            this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any cards', player, this);

            return true;
        }

        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, this.selectedCards);
        for(let card of this.selectedCards) {
            player.moveCard(card, 'hand');
        }

        return true;
    }
}

SmallPaul.code = '09033';

module.exports = SmallPaul;
