import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class InDaznaksPit extends DrawCard {
    // In Daznak's Pit (11094)
    // Shadow (3).
    // Interrupt: When the challenges phase ends, stand each character. Following this phase, there
    // is an additional challenges phase. (Max 1 per round.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            message:
                '{player} plays {source} to stand each character and start a new challenges phase',
            gameAction: GameActions.simultaneously((context) => [
                ...context.game
                    .filterCardsInPlay((card) => card.getType() === 'character' && card.kneeled)
                    .map((card) => GameActions.standCard({ card })),
                GameActions.addPhase({ phase: 'challenge' })
            ]),
            max: ability.limit.perRound(1)
        });
    }
}

InDaznaksPit.code = '11094';

export default InDaznaksPit;
