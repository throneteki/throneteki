const DrawCard = require('../../drawcard.js');

class SerCortnayPenrose extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    this.isParticipating()
            },
            handler: (context) => {
                context.player.standCard(this);
                this.game.addMessage('{0} stands {1}', context.player, this);
            }
        });
    }
}

SerCortnayPenrose.code = '10025';

module.exports = SerCortnayPenrose;
