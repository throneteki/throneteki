const DrawCard = require('../../drawcard.js');

class OldTattersalt extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return to shadows',
            cost: ability.costs.kneel(card => card.name === 'Blackbird'),
            handler: context => {
                context.player.putIntoShadows(this);
                this.game.addMessage('{0} kneels {1} to to return {2} to shadows', context.player, context.costs.kneel, this);
            }
        });
        
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: context.player.getTotalReserve(),
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getPrintedCost() <= 1,
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck and adds {2} to their hand', player, this, card);
        player.moveCard(card, 'hand');
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

OldTattersalt.code = '20021';

module.exports = OldTattersalt;
