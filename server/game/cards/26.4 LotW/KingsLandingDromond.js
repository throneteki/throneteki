import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLandingDromond extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.reduceNumberOfUnspentGoldReturned(1)
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    printedCostOrLower: 2,
                    condition: (card) => GameActions.returnCardToHand({ card }).allow()
                }
            },
            message: "{player} uses {source} to return {target} to its owner's hand",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

KingsLandingDromond.code = '26066';

export default KingsLandingDromond;
