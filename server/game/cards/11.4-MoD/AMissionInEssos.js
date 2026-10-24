import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

const drawThree = () => GameActions.drawCards((context) => ({ player: context.player, amount: 3 }));

class AMissionInEssos extends DrawCard {
    // A Mission in Essos (11076)
    // Shadow (2).
    // Action: Remove all but the bottom card of your deck from the game facedown. Then, shuffle
    // your discard pile into your deck and draw 3 cards.
    setupCardAbilities() {
        this.action({
            title: 'Remove deck from game',
            message:
                '{player} plays {source} to remove all but the bottom card of their deck from the game facedown',
            gameAction: GameActions.simultaneously((context) =>
                context.player.drawDeck
                    .slice(0, -1)
                    .map((card) => GameActions.removeFromGame({ card, facedown: true }))
            ).then({
                message:
                    'Then {player} shuffles their discard pile into their deck and draws 3 cards',
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.player.discardPile.length > 0,
                    thenAction: GameActions.shuffleIntoDeck((context) => ({
                        cards: [...context.player.discardPile]
                    })).then({ gameAction: drawThree() }),
                    elseAction: drawThree()
                })
            })
        });
    }
}

AMissionInEssos.code = '11076';

export default AMissionInEssos;
