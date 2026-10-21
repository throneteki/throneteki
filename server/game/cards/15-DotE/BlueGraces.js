import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                context.target.owner.moveCard(context.target, 'draw deck');
                context.target.owner.shuffleDrawDeck();
            }
        });
    }
}

BlueGraces.code = '15013';

export default BlueGraces;
