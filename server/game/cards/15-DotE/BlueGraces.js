import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlueGraces extends DrawCard {
    // Blue Graces (15013)
    // Challenges Action: Remove Blue Graces from the game to choose a card with printed cost 6 or
    // higher in your discard or dead pile and shuffle it into your deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle card back into deck',
            phase: 'challenge',
            cost: ability.costs.removeSelfFromGame(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: {
                    controller: 'current',
                    location: ['discard pile', 'dead pile'],
                    printedCostOrHigher: 6
                }
            },
            message:
                '{player} removes {source} from the game to shuffle {target} back into their deck',
            gameAction: GameActions.shuffleIntoDeck((context) => ({ cards: [context.target] }))
        });
    }
}

BlueGraces.code = '15013';

export default BlueGraces;
