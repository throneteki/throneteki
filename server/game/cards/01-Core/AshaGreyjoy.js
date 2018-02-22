const DrawCard = require('../../drawcard.js');

class AshaGreyjoy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => this.controller === event.challenge.winner && event.challenge.isParticipating(this) && event.challenge.isUnopposed()
            },
            handler: () => {
                this.controller.standCard(this);
                this.game.addMessage('{0} uses {1} to stand {1}', this.controller, this, this);
            }
        });
    }
}

AshaGreyjoy.code = '01067';

module.exports = AshaGreyjoy;
