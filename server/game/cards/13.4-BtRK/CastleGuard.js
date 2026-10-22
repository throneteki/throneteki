import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';
import GameActions from '../../GameActions/index.js';

class CastleGuard extends DrawCard {
    // Castle Guard (13067)
    // Shadow (3).
    // Reaction: After Castle Guard comes out of shadows, choose another character that came out of
    // shadows this phase. Return that character to shadows.
    setupCardAbilities() {
        this.tracker = GenericTracker.forPhase(this.game, 'onCardOutOfShadows');

        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card !== context.source &&
                    card.getType() === 'character' &&
                    context.source.tracker.some((event) => event.card === card)
            },
            message: '{player} uses {source} to return {target} to shadows',
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.target }))
        });
    }
}

CastleGuard.code = '13067';

export default CastleGuard;
