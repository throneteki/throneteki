import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerCortnayPenrose extends DrawCard {
    // Ser Cortnay Penrose (10025)
    // Reaction: After you win a [power] challenge in which Ser Cortnay Penrose is participating,
    // stand him.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            message: '{player} stands {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

SerCortnayPenrose.code = '10025';

export default SerCortnayPenrose;
