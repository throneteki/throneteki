const DrawCard = require('../../drawcard.js');

class SerGregorsMarauders extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPillage: event => event.source === this && event.discardedCard.getType() === 'event'
            },
            handler: () => {
                this.controller.standCard(this);
                this.game.addMessage('{0} uses {1} to stand {1}', this.controller, this);
            }
        });
    }
}

SerGregorsMarauders.code = '05008';

module.exports = SerGregorsMarauders;
