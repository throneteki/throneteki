import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Varys extends DrawCard {
    // Varys (01029)
    // Stealth.
    // Interrupt: When the dominance phase ends, remove Varys from the game to discard each
    // character from play.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'dominance' &&
                    context.game.anyCardsInPlay(
                        (card) => card.getType() === 'character' && card !== context.source
                    )
            },
            cost: ability.costs.removeSelfFromGame(),
            message: '{player} removes {source} from the game to discard all characters',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay((card) => card.getType() === 'character')
                    .map((card) => GameActions.discardCard({ card }))
            )
        });
    }
}

Varys.code = '01029';

export default Varys;
