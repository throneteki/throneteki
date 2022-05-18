const DrawCard = require('../../drawcard');

class DevanSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner === this.controller
            },
            cost: ability.costs.discardXGold(() => 1, () => 99),
            message: {
                format: '{player} discards {discardedGold} gold from {source} to search their deck for a non-limited location',
                args: { discardedGold: context => context.xValue }
            },
            handler: context => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'location' && !card.isLimited() && card.getPrintedCost() <= context.xValue && this.controller.canPutIntoPlay(card),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            player.putIntoPlay(card, 'hand');
            this.game.addMessage('{0} puts {1} into play',
                player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not put any card into play',
            player);
    }
}

DevanSeaworth.code = '08027';

module.exports = DevanSeaworth;
