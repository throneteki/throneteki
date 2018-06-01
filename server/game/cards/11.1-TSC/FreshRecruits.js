const DrawCard = require('../../drawcard');

class FreshRecruits extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck',
            handler: () => {
                this.selectedCards = [];
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select cards',
                    numToSelect: 3,
                    cardCondition: card => card.getType() === 'character' && this.remainingTraits().some(trait => card.hasTrait(trait)),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    remainingTraits() {
        const traits = ['Ranger', 'Builder', 'Steward'];
        return traits.filter(trait => !this.selectedCards.some(card => card.hasTrait(trait)));
    }

    cardSelected(player, card) {
        this.selectedCards.push(card);
        return true;
    }

    doneSelecting(player) {
        if(this.selectedCards.length === 0) {
            this.game.addMessage('{0} plays {1} to search their deck, but does not add any cards to their hand', player, this);
            return true;
        }

        for(let card of this.selectedCards) {
            player.moveCard(card, 'hand');
        }
        this.game.addMessage('{0} plays {1} to search their deck and adds {2} to their hand', player, this, this.selectedCards);

        return true;
    }
}

FreshRecruits.code = '11007';

module.exports = FreshRecruits;
