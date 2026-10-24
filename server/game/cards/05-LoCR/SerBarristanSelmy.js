import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerBarristanSelmy extends DrawCard {
    // Ser Barristan Selmy (05035)
    // Reaction: After you win a challenge in which Ser Barristan Selmy is participating, if you
    // have fewer cards in hand than the losing opponent, stand him.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.source.controller.getHandCount() < event.challenge.loser.getHandCount()
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

SerBarristanSelmy.code = '05035';

export default SerBarristanSelmy;
