import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { availableToPair } from '../../../Array.js';
import TextHelper from '../../TextHelper.js';

class SteelRain extends DrawCard {
    // "Steel Rain" (11032)
    // Shadow (2).
    // Action: Sacrifice any number of [greyjoy] locations. For each location sacrificed, search
    // your deck for a different [greyjoy] location with equal or lower printed cost and put it into
    // play. Shuffle your deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for GJ locations',
            cost: ability.costs.sacrificeAny(
                (card) => card.isFaction('greyjoy') && card.getType() === 'location',
                false
            ),
            message: {
                format: '{player} plays {source} to sacrifice {costs.sacrifice} and search their deck for up to {amount} Greyjoy locations',
                args: { amount: (context) => context.costs.sacrifice.length }
            },
            gameAction: GameActions.search({
                title: (context) =>
                    `Select locations for ${TextHelper.formatList(
                        context.costs.sacrifice.map((card) => card.name),
                        'and'
                    )}`,
                numToSelect: (context) => context.costs.sacrifice.length,
                match: {
                    faction: 'greyjoy',
                    type: 'location',
                    condition: (card, context) =>
                        availableToPair(
                            context.costs.sacrifice || [],
                            context.selectedCards,
                            (sacrificed, card) =>
                                context.source.isSelectableLocationFor(sacrificed, card)
                        ).some((available) =>
                            context.source.isSelectableLocationFor(available, card)
                        )
                },
                reveal: false,
                message: '{player} puts {searchTarget} into play from their draw deck',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) => GameActions.putIntoPlay({ card }))
                )
            })
        });
    }

    isSelectableLocationFor(sacrificed, card) {
        return (
            card.name !== sacrificed.name &&
            card.hasPrintedCost() &&
            sacrificed.hasPrintedCost() &&
            card.getPrintedCost() <= sacrificed.getPrintedCost()
        );
    }
}

SteelRain.code = '11032';

export default SteelRain;
