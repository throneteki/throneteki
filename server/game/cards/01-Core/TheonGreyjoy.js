const DrawCard = require('../../drawcard.js');

class TheonGreyjoy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.isParticipating(this) && event.challenge.isUnopposed()
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1} after winning an unopposed challenge', this.controller, this);
            }
        });
    }
}

TheonGreyjoy.code = '01071';

module.exports = TheonGreyjoy;
