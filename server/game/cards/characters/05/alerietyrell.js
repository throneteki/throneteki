const DrawCard = require('../../../drawcard.js');

class AlerieTyrell extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card to add to your hand',
                    cardCondition: card => card.getType() === 'character' && card.isFaction('tyrell') && card.getCost() <= 3,
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
                             player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
                             player, this);
    }
}

AlerieTyrell.code = '05037';

module.exports = AlerieTyrell;
