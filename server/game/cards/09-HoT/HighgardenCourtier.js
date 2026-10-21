import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HighgardenCourtier extends DrawCard {
    // Highgarden Courtier (09015)
    // Reaction: After another character’s STR is increased by a card effect, kneel Highgarden
    // Courtier to stand that character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStrengthChanged: (event, context) =>
                    event.card !== context.source &&
                    event.card.controller === context.source.controller &&
                    event.amount > 0 &&
                    event.applying &&
                    event.card.kneeled
            },
            cost: ability.costs.kneelSelf(),
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} kneels {source} to stand {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.event.card }))
        });
    }
}

HighgardenCourtier.code = '09015';

export default HighgardenCourtier;
