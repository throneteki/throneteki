import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaegeMormont extends DrawCard {
    // Maege Mormont (08021)
    // Renown.
    // Reaction: After you win a challenge in which you control a participating House Mormont
    // character, reveal the top card of your deck. If it is a [stark] card, draw it.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    context.player.anyCardsInPlay(
                        (card) => card.isParticipating() && card.hasTrait('House Mormont')
                    )
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => context.event.cards[0].isFaction('stark'),
                message: '{player} {gameAction}',
                gameAction: GameActions.drawSpecific((context) => ({
                    player: context.player,
                    cards: context.parentContext.revealed
                }))
            })
        });
    }
}

MaegeMormont.code = '08021';

export default MaegeMormont;
