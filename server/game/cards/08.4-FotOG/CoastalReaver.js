const DrawCard = require('../../drawcard.js');

class CoastalReaver extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            chooseOpponent: opponent => opponent.hand.size() > 0,
            handler: context => {
                this.game.addMessage('{0} uses {1} to choose {2}', context.player, this, context.opponent);

                this.game.promptForSelect(context.opponent, {
                    acticePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: card => card.location === 'hand' && card.controller === context.opponent,
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onCardSelected(player, card) {
        card.owner.moveCardToTopOfDeck(card);
        this.game.addMessage('{0} moves one card to the top of their deck for {1}', player, this);

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1} even though they had card(s) in their hand',
            player, this);

        return true;
    }
}

CoastalReaver.code = '08071';

module.exports = CoastalReaver;
