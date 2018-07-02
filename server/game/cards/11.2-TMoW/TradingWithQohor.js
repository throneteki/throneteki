const AgendaCard = require('../../agendacard.js');

class TradingWithQohor extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.anyCardsInPlay(card => card.getType() === 'attachment'),
            match: card => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyGold(1)
        });

        this.reaction({
            when: {
                onClaimApplied: event => event.player === this.controller
            },
            cost: ability.costs.sacrifice(card => card.getType() === 'attachment'),
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardType: 'attachment',
                    onSelect: (player, card) => this.cardSelected(player, card, context.costs.sacrifice),
                    onCancel: player => this.doneSelecting(player, context.costs.sacrifice),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, costCard) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} and sacrifices {2} to search their deck and put {3} into play',
            player, this, costCard, card);
    }

    doneSelecting(player, costCard) {
        this.game.addMessage('{0} uses {1} and sacrifices {2} to search their deck, but does not put any card into play',
            player, this, costCard);
    }
}

TradingWithQohor.code = '11039';

module.exports = TradingWithQohor;
