import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Lightbringer extends DrawCard {
    // Lightbringer (01058)
    // [baratheon] character only.
    // If attached character is Stannis Baratheon, he gains renown.
    // Reaction: After attached character gains 1 or more power, stand it. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'baratheon' });
        this.whileAttached({
            match: (card) => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card === context.source.parent && event.card.kneeled
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
        });
    }
}

Lightbringer.code = '01058';

export default Lightbringer;
