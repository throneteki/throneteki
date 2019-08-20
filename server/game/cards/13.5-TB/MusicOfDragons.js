const DrawCard = require('../../drawcard');

class MusicOfDragons extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck',
            phase: 'challenge',
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && card.hasTrait('Dragon'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck but does not add any card to their hand',
            player, this);
    }
}

MusicOfDragons.code = '13094';

module.exports = MusicOfDragons;
