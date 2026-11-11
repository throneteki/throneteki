import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLandingDromond extends DrawCard {
    // King's Landing Dromond (26066)
    // Shadow (1).
    // Reduce the number of unspent gold you return to the treasury during the taxation phase by 1.
    // Reaction: After King's Landing Dromond comes out of shadows, choose a character with printed
    // cost 2 or lower and return it to its owner's hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.reduceNumberOfUnspentGoldReturned(1)
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
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
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

KingsLandingDromond.code = '26066';

export default KingsLandingDromond;
