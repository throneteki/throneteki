import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WickWittlestick extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card === this &&
                    this.controller.anyCardsInPlay({ type: 'character', participating: true })
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    GameActions.discardCard({ card }).allow()
            },
            message: '{player} uses {source} to discard {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) => GameActions.discardCard({ card }))
                    ),
                    context
                );
            }
        });
    }
}

WickWittlestick.code = '26109';

export default WickWittlestick;
