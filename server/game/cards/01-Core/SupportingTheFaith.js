import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class SupportingTheFaith extends PlotCard {
    // Supporting the Faith (01023)
    // Forced Reaction: After the challenges phase begins, each player returns all gold in his or
    // her gold pool to the treasury.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            message: '{player} uses {source} to make each player return their gold to the treasury',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayers()
                    .map((player) =>
                        GameActions.returnGoldToTreasury({ player, amount: player.gold })
                    )
            )
        });
    }
}

SupportingTheFaith.code = '01023';

export default SupportingTheFaith;
