import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Butterbumps extends DrawCard {
    // Butterbumps (02103)
    // Insight.
    // Forced Reaction: After you lose a challenge in which Butterbumps is participating, discard 1
    // card at random from your hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.isParticipating()
            },
            message:
                '{player} is forced to use {source} to discard a card from their hand after losing a challenge',
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.player,
                amount: 1
            }))
        });
    }
}

Butterbumps.code = '02103';

export default Butterbumps;
