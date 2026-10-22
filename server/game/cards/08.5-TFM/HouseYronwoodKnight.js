import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HouseYronwoodKnight extends DrawCard {
    // House Yronwood Knight (08095)
    // Reaction: After you lose a challenge in which House Yronwood Knight is participating, discard
    // 1 card at random from the winning opponent's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.isParticipating()
            },
            message: {
                format: "{player} uses {source} to discard 1 card at random from {winner}'s hand",
                args: { winner: (context) => context.game.currentChallenge.winner }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.game.currentChallenge.winner,
                amount: 1
            }))
        });
    }
}

HouseYronwoodKnight.code = '08095';

export default HouseYronwoodKnight;
