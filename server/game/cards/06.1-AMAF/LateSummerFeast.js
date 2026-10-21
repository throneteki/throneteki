import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class LateSummerFeast extends PlotCard {
    // Late Summer Feast (06020)
    // Forced Reaction: After you win a challenge, the losing opponent may draw 1 card.
    setupCardAbilities() {
        const loser = (context) => context.event.challenge.loser;

        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && event.challenge.loser.canDraw()
            },
            message: {
                format: '{player} is forced by {source} to let {loser} draw 1 card',
                args: { loser }
            },
            gameAction: GameActions.may({
                player: loser,
                title: (context) => `Draw 1 card from ${context.source.name}?`,
                message: '{choosingPlayer} draws 1 card',
                gameAction: GameActions.drawCards((context) => ({
                    player: loser(context),
                    amount: 1
                }))
            })
        });
    }
}

LateSummerFeast.code = '06020';

export default LateSummerFeast;
