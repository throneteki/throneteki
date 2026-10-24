import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NarrowSeaDromond extends DrawCard {
    // Narrow Sea Dromond (26042)
    // Shadow (1).
    // Narrow Sea Dromond contributes 1 STR to your total for dominance.
    // Reaction: After Narrow Sea Dromond comes out of shadows, choose and kneel a character with
    // printed cost 4 or lower.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyDominanceStrength(1)
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    printedCostOrLower: 4,
                    condition: (card) => GameActions.kneelCard({ card }).allow()
                }
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

NarrowSeaDromond.code = '26042';

export default NarrowSeaDromond;
