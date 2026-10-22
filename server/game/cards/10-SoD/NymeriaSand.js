import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NymeriaSand extends DrawCard {
    // Nymeria Sand (10007)
    // Reaction: After you lose dominance, discard 1 card at random from the winning opponent's hand
    // and draw 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    event.winner && event.winner !== context.player
            },
            message: '{player} uses {source} and {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.discardAtRandom((context) => ({
                    player: context.event.winner,
                    amount: 1
                })),
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

NymeriaSand.code = '10007';

export default NymeriaSand;
