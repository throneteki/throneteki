import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HeadsOnPikes extends DrawCard {
    // Heads on Pikes (16023)
    // Prized 2.
    // Dominance Action: For each character in his or her dead pile, each opponent discards the top
    // 2 cards of his or her deck. (Max 1 per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard cards',
            phase: 'dominance',
            message:
                '{player} plays {source} to have each opponent discard cards from the top of their deck',
            gameAction: GameActions.simultaneously((context) =>
                context.game.getOpponents(context.player).map((opponent) =>
                    GameActions.discardTopCards({
                        player: opponent,
                        amount: opponent.deadPile.length * 2,
                        source: context.source
                    })
                )
            ),
            max: ability.limit.perRound(1)
        });
    }
}

HeadsOnPikes.code = '16023';

export default HeadsOnPikes;
