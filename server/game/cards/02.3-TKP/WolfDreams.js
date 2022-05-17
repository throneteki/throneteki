const DrawCard = require('../../drawcard.js');

class WolfDreams extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for a Direwolf',
            cost: ability.costs.kneelFactionCard(),
            message: '{player} plays {source} and kneels their faction card to search their deck for a Direwolf card',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Direwolf'),
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
            this.game.addMessage('{0} add {1} to their hand',
                player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

WolfDreams.code = '02042';

module.exports = WolfDreams;
