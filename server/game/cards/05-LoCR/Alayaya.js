import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Alayaya extends DrawCard {
    // Alayaya (05013)
    // Reaction: After you win a challenge in which Alayaya is participating, move 1 gold from the
    // losing opponent's gold pool to your own.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isParticipating()
            },
            message: {
                format: "{player} uses {source} to move 1 gold from {opponent}'s gold pool to their own",
                args: { opponent: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.transferGold((context) => ({
                from: context.event.challenge.loser,
                to: context.player,
                amount: 1
            }))
        });
    }
}

Alayaya.code = '05013';

export default Alayaya;
