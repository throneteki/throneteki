const DrawCard = require('../../../drawcard.js');

class DoransGame extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.challengeType === 'intrigue' &&
                    challenge.strengthDifference >= 5
                )
            },
            handler: () => {
                let power = this.controller.getNumberOfUsedPlots();

                this.game.addPower(this.controller, power);
                this.game.addMessage('{0} uses {1} to gain {2} power for their faction', this.controller, this, power);
            }
        });
    }
}

DoransGame.code = '01119';

module.exports = DoransGame;
