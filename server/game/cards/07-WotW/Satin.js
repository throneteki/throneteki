import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Satin extends DrawCard {
    // Satin (07013)
    // No attachments except Weapon.
    // Reaction: After Satin is knelt, choose and stand another Steward character. (Limit twice per
    // phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: (event, context) => event.card === context.source
            },
            limit: ability.limit.perPhase(2),
            target: {
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.location === 'play area' &&
                    card.hasTrait('Steward') &&
                    card.getType() === 'character' &&
                    card.kneeled
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

Satin.code = '07013';

export default Satin;
