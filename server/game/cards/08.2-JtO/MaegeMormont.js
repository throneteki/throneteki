import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaegeMormont extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasParticipatingMormont()
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

    hasParticipatingMormont() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.hasTrait('House Mormont')
        );
    }
}

MaegeMormont.code = '08021';

export default MaegeMormont;
