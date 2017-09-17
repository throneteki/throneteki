const DrawCard = require('../../drawcard.js');

class Polliver extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPillage: event => (
                    event.source === this &&
                    event.discardedCard.getType() === 'character' &&
                    event.discardedCard.owner.gold >= 1
                )
            },
            handler: context => {
                let otherPlayer = context.event.discardedCard.owner;
                this.game.addGold(otherPlayer, -2);
                this.game.addMessage('{0} uses {1} have {2} return 2 gold to the treasury', this.controller, this, otherPlayer);
            }
        });
    }
}

Polliver.code = '06029';

module.exports = Polliver;
