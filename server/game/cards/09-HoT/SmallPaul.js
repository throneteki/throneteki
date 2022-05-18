const DrawCard = require('../../drawcard.js');

class SmallPaul extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            message: {
                format: '{player} uses {source} to search the top {reserve} cards of their deck for any number of Steward characters',
                args: { reserve: () => this.controller.getTotalReserve() }
            },
            handler: () => {
                let reserve = this.controller.getTotalReserve();
                this.game.promptForDeckSearch(this.controller, {
                    numCards: reserve,
                    numToSelect: reserve,
                    activePromptTitle: 'Select any number of Stewards',
                    cardCondition: card => card.hasTrait('Steward') && card.getType() === 'character',
                    onSelect: (player, cards, valids) => this.selectCards(player, cards, valids),
                    onCancel: player => this.cancelSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCards(player, cards, valids) {
        if(valids.length > 0) {
            this.game.addMessage('{0} adds {1} to their hand', player, valids);
            for(let card of valids) {
                player.moveCard(card, 'hand');
            }
        }
    }

    cancelSelecting(player) {
        this.game.addMessage('{0} does not add any cards to their hand', player);
    }
}

SmallPaul.code = '09033';

module.exports = SmallPaul;
