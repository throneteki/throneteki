import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBastardsBoys extends DrawCard {
    // The Bastard's Boys (24017)
    // Assault.
    // Challenges Action: Sacrifice The Bastard's Boys to put a House Bolton or non-[stark]
    // character with printed cost 5 or lower into play from your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to put character into play',
            phase: 'challenge',
            target: {
                cardCondition: {
                    location: 'hand',
                    controller: 'current',
                    type: 'character',
                    printedCostOrLower: 5,
                    or: [{ not: { faction: 'stark' } }, { trait: 'House Bolton' }],
                    condition: (card, context) => context.player.canPutIntoPlay(card)
                }
            },
            cost: ability.costs.sacrificeSelf(),
            message:
                '{player} sacrifices {costs.sacrifice} to put {target} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.target }))
        });
    }
}

TheBastardsBoys.code = '24017';

export default TheBastardsBoys;
