const DrawCard = require('../../drawcard.js');

class BearIslandScout extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal' && this.eachCharacterIsStark()
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('House Mormont'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    eachCharacterIsStark() {
        let charactersInPlay = this.game.allCards.filter(card => card.controller === this.controller && card.location === 'play area' && card.getType() === 'character');

        return charactersInPlay.every(card => card.isFaction('stark'));
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');

        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add a card to their hand', player, this);
    }
}

BearIslandScout.code = '11081';

module.exports = BearIslandScout;
