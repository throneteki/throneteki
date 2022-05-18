const DrawCard = require('../../drawcard.js');

class TheQueenOfThorns extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this
            },
            cost: ability.costs.discardFromHand(card => card.getType() === 'event'),
            message: '{player} uses {source} and discards {costs.discardFromHand} from their hand to search their deck for an event',
            handler: context => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'event',
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
            this.game.addMessage('{0} adds {1} to their hand',
                player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

TheQueenOfThorns.code = '09004';

module.exports = TheQueenOfThorns;
