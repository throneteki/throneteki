import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHigherMysteries extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasParticipatingMaester()
            },
            message: '{player} plays {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => context.parentContext.revealed.length > 0,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.parentContext.revealed[0]
                }))
            })
        });
    }

    hasParticipatingMaester() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.hasTrait('Maester') && card.isParticipating() && card.getType() === 'character'
        );
    }
}

TheHigherMysteries.code = '20048';

export default TheHigherMysteries;
