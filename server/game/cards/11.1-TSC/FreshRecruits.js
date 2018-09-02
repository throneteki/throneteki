const DrawCard = require('../../drawcard');

class FreshRecruits extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select cards',
                    numToSelect: 3,
                    cardCondition: (card, context) => card.getType() === 'character' && this.remainingTraits(context.selectedCards).some(trait => card.hasTrait(trait)),
                    onSelect: (player, cards) => this.selectCards(player, cards),
                    onCancel: player => this.cancelSearch(player),
                    source: this
                });
            }
        });
    }

    remainingTraits(selectedCards) {
        const traits = ['Ranger', 'Builder', 'Steward'];
        return traits.filter(trait => !selectedCards.some(card => card.hasTrait(trait)));
    }

    selectCards(player, cards) {
        for(let card of cards) {
            player.moveCard(card, 'hand');
        }
        this.game.addMessage('{0} plays {1} to search their deck and adds {2} to their hand', player, this, cards);
        return true;
    }

    cancelSearch(player) {
        this.game.addMessage('{0} plays {1} to search their deck, but does not add any cards to their hand', player, this);
        return true;
    }
}

FreshRecruits.code = '11007';

module.exports = FreshRecruits;
