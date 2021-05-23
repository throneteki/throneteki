
const DrawCard = require('../../drawcard.js');
const Conditions = require('../../Conditions');

class BearIslandScout extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal' && Conditions.allCharactersAreStark({ player: this.controller })
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('House Mormont'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }
    
    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search the top 10 cards of their deck and add {2} to their hand', player, this, card);
        return true;
    }
    
    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search the top 10 cards of their deck, but does not add any card to their hand', player, this);
    }
}

BearIslandScout.code = '17124';

module.exports = BearIslandScout;
