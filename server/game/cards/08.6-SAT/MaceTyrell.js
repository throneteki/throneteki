const DrawCard = require('../../drawcard.js');

class MaceTyrell extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this
            },
            handler: () => {
                this.controller.drawCardsToHand(2);
                this.game.addMessage('{0} uses {1} to draw 2 cards', this.controller, this);

                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.controller === this.controller && card.location === 'hand',
                    onSelect: (player, card) => this.putCardBack(player, card),
                    onCancel: player => this.cancelResolution(player)
                });
            }
        });
        this.plotModifiers({
            gold: 1
        });
    }

    putCardBack(player, card) {
        card.owner.moveCardToTopOfDeck(card);
        this.game.addMessage('{0} then places a card on top of their draw deck for {1}', this.controller, this);

        return true;
    }

    cancelResolution(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);

        return true;
    }
}

MaceTyrell.code = '08103';

module.exports = MaceTyrell;
