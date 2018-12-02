const DrawCard = require('../../drawcard.js');

class DrownedProphet extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 5,
                    cardCondition: card => card.isFaction('greyjoy'),
                    activePromptTitle: 'Select a card',
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'dead pile');
        this.game.addMessage('{0} plays {1} to search their deck and places {2} in their dead pile', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} plays {1} to search their deck but does not add any card to their dead pile', player, this);
    }
}

DrownedProphet.code = '12013';

module.exports = DrownedProphet;
