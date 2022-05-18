const DrawCard = require('../../drawcard.js');

class OldTattersalt extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return to shadows',
            cost: ability.costs.kneel(card => card.name === 'Blackbird'),
            message: '{player} kneels {costs.kneel} to return {source} to shadows',
            handler: context => {
                context.player.putIntoShadows(this);
            }
        });
        
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            message: {
                format: '{player} uses {source} to search the top {reserve} cards of their deck for a card with printed cost 1 or lower',
                args: { reserve: context => context.player.getTotalReserve() }
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: context.player.getTotalReserve(),
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getPrintedCost() <= 1,
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            this.game.addMessage('{0} adds {1} to their hand', player, card);
            player.moveCard(card, 'hand');
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

OldTattersalt.code = '20021';

module.exports = OldTattersalt;
