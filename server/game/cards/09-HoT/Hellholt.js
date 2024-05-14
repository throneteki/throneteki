const DrawCard = require('../../drawcard.js');

class Hellholt extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
            }
        });
    }
}

Hellholt.code = '09032';

module.exports = Hellholt;
