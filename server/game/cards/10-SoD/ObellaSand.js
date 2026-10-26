import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ObellaSand extends DrawCard {
    // Obella Sand (10010)
    // Reaction: After Obella Sand is discarded for [intrigue] claim or killed for [military] claim,
    // move 1 power from the winning opponent's faction card to your own. Shuffle Obella Sand from
    // your discard or dead pile into your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card === context.source && event.isClaim,
                onCardDiscarded: (event, context) => event.card === context.source && event.isClaim
            },
            location: ['dead pile', 'discard pile'],
            message: '{player} uses {source} to {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.movePower((context) => ({
                    from: context.event.claimWinner.faction,
                    to: context.player.faction,
                    amount: 1
                })),
                GameActions.shuffleIntoDeck((context) => ({ cards: [context.source] }))
            ])
        });
    }
}

ObellaSand.code = '10010';

export default ObellaSand;
