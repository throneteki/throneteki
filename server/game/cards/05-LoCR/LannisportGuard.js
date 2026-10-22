import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LannisportGuard extends DrawCard {
    // Lannisport Guard (05016)
    // Reaction: After you marshal Lannisport Guard, each player draws 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            message: '{player} uses {source} to have each player draw 1 card',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayers()
                    .map((player) => GameActions.drawCards({ player, amount: 1 }))
            )
        });
    }
}

LannisportGuard.code = '05016';

export default LannisportGuard;
