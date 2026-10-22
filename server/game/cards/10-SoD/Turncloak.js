import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Turncloak extends DrawCard {
    // Turncloak (10032)
    // Non-loyal character only. Terminal.
    // Reaction: After you win a challenge in which attached character is participating, take
    // control of attached character. (Any player may initiate this ability.)
    setupCardAbilities() {
        this.attachmentRestriction({ loyal: false });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isParticipating(context.source.parent)
            },
            player: (event) => event.challenge.winner,
            message: {
                format: '{player} uses {source} to take control of {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.takeControl((context) => ({
                player: context.player,
                card: context.source.parent
            }))
        });
    }
}

Turncloak.code = '10032';

export default Turncloak;
