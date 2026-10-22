import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MoonBoy extends DrawCard {
    // Moon Boy (02047)
    // Insight.
    // Forced Reaction: After you lose a challenge in which Moon Boy is participating, discard 1
    // card at random from your hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.isParticipating()
            },
            message:
                '{player} is forced to discard 1 card at random after losing a challenge in which {source} was participating',
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.player,
                amount: 1
            }))
        });
    }
}

MoonBoy.code = '02047';

export default MoonBoy;
