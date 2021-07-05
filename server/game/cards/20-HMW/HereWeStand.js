const DrawCard = require('../../drawcard.js');

class HereWeStand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search for Mormont cards',
            phase: 'dominance',
            condition: () => this.hasStandingMormontCharacter(),
            handler: context => {
                this.selectedCards = [];
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    numToSelect: 10,
                    activePromptTitle: 'Select any number of Mormont cards',
                    cardCondition: card => card.hasTrait('House Mormont') || card.name === 'Bear Island' || card.name === 'Bearskin Cloak',
                    onSelect: (player, cards) => this.selectCards(player, cards),
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
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any cards to their hand', player, this);
    }
    
    hasStandingMormontCharacter() {
        return this.controller.anyCardsInPlay(card => !card.kneeled && card.hasTrait('House Mormont') && card.getType() === 'character');
    }
}

HereWeStand.code = '20030';

module.exports = HereWeStand;
