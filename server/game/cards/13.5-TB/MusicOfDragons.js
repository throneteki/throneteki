const DrawCard = require('../../drawcard');

class MusicOfDragons extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck',
            phase: 'challenge',
            message: '{player} plays {source} to search their deck for a Dragon character',
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && card.hasTrait('Dragon'),
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

MusicOfDragons.code = '13094';

module.exports = MusicOfDragons;
