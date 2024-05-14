const DrawCard = require('../../drawcard.js');

class TheRedViper extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    event.challenge.strengthDifference >= 5 &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                let power = Math.trunc(this.game.currentChallenge.strengthDifference / 5);
                this.modifyPower(power);

                this.game.addMessage('{0} gains {1} power on {2}', this.controller, power, this);
            }
        });
    }
}

TheRedViper.code = '01109';

module.exports = TheRedViper;
