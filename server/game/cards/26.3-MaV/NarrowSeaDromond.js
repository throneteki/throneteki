import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NarrowSeaDromond extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyDominanceStrength(1)
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kneelCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

NarrowSeaDromond.code = '26042';

export default NarrowSeaDromond;
