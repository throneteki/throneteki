import DrawCard from '../../drawcard.js';

class SerCortnayPenrose extends DrawCard {
    // Ser Cortnay Penrose (10025)
    // Reaction: After you win a [power] challenge in which Ser Cortnay Penrose is participating,
    // stand him.
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

export default SerCortnayPenrose;
