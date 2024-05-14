const DrawCard = require('../../drawcard.js');

class KingBalonsSolar extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiativeDetermined: (event) =>
                    event.winner === this.controller && this.controller.canGainGold()
            },
            handler: (context) => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', context.player, this);
            }
        });
    }
}

KingBalonsSolar.code = '04072';

module.exports = KingBalonsSolar;
