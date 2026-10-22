import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterLomys extends DrawCard {
    // Maester Lomys (01180)
    // Reaction: After you win an [intrigue] challenge as the defending player, discard 1 card at
    // random from the attacking player's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.defendingPlayer === context.source.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            message: {
                format: "{player} uses {source} to discard 1 card at random from {loser}'s hand",
                args: { loser: (context) => context.game.currentChallenge.loser }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.game.currentChallenge.loser,
                amount: 1
            }))
        });
    }
}

MaesterLomys.code = '01180';

export default MaesterLomys;
