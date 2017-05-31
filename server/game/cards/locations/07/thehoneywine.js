const DrawCard = require('../../../drawcard.js');

class TheHoneywine extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => (
                    challenge.winner === this.controller && 
                    challenge.attackingPlayer === this.controller &&
                    challenge.strengthDifference >= 5)
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
            }
        });
    }
}

TheHoneywine.code = '07038';

module.exports = TheHoneywine;
