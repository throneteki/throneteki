const DrawCard = require('../../drawcard.js');

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.winner === this.controller
                    && event.challenge.isParticipating(this)
                    && this.controller.hand.size() < event.challenge.loser.hand.size()
            },
            handler: () => {
                this.controller.standCard(this);
                this.game.addMessage('{0} uses {1} to stand {1}',
                    this.controller, this, this);
            }
        });
    }
}

SerBarristanSelmy.code = '05035';

module.exports = SerBarristanSelmy;
