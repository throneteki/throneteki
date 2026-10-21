import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Biter extends DrawCard {
    // Biter (26037)
    // Intimidate.
    // Reaction: After Biter kneels a character with a lower STR than his using intimidate,
    // sacrifice him to kill that character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: (event, context) =>
                    event.source === context.source &&
                    event.reason === 'intimidate' &&
                    event.card.getStrength() < context.source.getStrength()
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {costs.sacrifice} to kill {character}',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.kill((context) => ({ card: context.event.card }))
        });
    }
}

Biter.code = '26037';

export default Biter;
