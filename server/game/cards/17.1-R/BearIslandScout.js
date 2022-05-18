
const DrawCard = require('../../drawcard.js');
const Conditions = require('../../Conditions');

class BearIslandScout extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal' && Conditions.allCharactersAreStark({ player: this.controller })
            },
            message: '{player} uses {source} to search the top 10 cards of their deck for a House Mormont card',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('House Mormont'),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }
    
    cardSelected(player, card, valid) {
        if(valid) {
            player.moveCard(card, 'hand');
            this.game.addMessage('{0} adds {1} to their hand', player, card);
        }
        return true;
    }
    
    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand', player);
    }
}

BearIslandScout.code = '17124';

module.exports = BearIslandScout;
