const DrawCard = require('../../../drawcard.js');

class TheQueenOfThorns extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: (e, player, card) => card === this
            },
            cost: ability.costs.discardFromHand(card => card.getType() === 'event'),
            handler: context => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card to add to your hand',
                    cardCondition: card => card.getType() === 'event',
                    onSelect: (player, card) => this.cardSelected(player, card, context.discardCostCard),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, discardedCard) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} and discards {2} from their hand to search their deck and add {3} to their hand',
            player, this, discardedCard, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck but does not add any card to their hand',
            player, this);
    }
}

TheQueenOfThorns.code = '09004';

module.exports = TheQueenOfThorns;
