const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class UnbridledGenerosity extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put gold on cards',
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 3,
                    multiSelect: true,
                    activePromptTitle: 'Select up to 3 cards',
                    source: this,
                    cardCondition: card => card.location === 'play area',
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }
    targetsSelected(player, cards) {
        _.each(cards, card => {
            card.addToken('gold', 1);
        });

        this.game.addMessage('{0} plays {1} to move 1 gold from the treasury to {2}',
                              this.controller, this, cards);

        return true;
    }
}

UnbridledGenerosity.code = '06118';

module.exports = UnbridledGenerosity;
