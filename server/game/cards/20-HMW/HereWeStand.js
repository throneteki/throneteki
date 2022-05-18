const DrawCard = require('../../drawcard.js');

class HereWeStand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search for Mormont cards',
            phase: 'dominance',
            condition: () => this.hasStandingMormontCharacter(),
            message: '{player} plays {source} to search the top 10 cards of their deck for any number of Bear Island, Bearskin Cloak, and House Mormont cards',
            handler: context => {
                this.selectedCards = [];
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    numToSelect: 10,
                    activePromptTitle: 'Select any number of Mormont cards',
                    cardCondition: card => card.hasTrait('House Mormont') || card.name === 'Bear Island' || card.name === 'Bearskin Cloak',
                    onSelect: (player, cards, valids) => this.selectCards(player, cards, valids),
                    onCancel: player => this.cancelSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCards(player, cards, valids) {
        if(valids.length > 0) {
            this.game.addMessage('{0} adds {1} to their hand', player, valids);
            for(let card of valids) {
                player.moveCard(card, 'hand');
            }
        }
    }

    cancelSelecting(player) {
        this.game.addMessage('{0} does not add any cards to their hand', player, this);
    }
    
    hasStandingMormontCharacter() {
        return this.controller.anyCardsInPlay(card => !card.kneeled && card.hasTrait('House Mormont') && card.getType() === 'character');
    }
}

HereWeStand.code = '20030';

module.exports = HereWeStand;
