import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class WeTakeWesteros extends PlotCard {
    // We Take Westeros! (17109)
    // Challenges Action: Kneel a Raider character to choose a location with lower printed cost in a
    // discard pile and put it into play under your control. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            phase: 'challenge',
            title: 'Put location into play',
            cost: ability.costs.kneel(
                (card) => card.getType() === 'character' && card.hasTrait('Raider')
            ),
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'location' &&
                    (!context.costs.kneel ||
                        card.getPrintedCost() < context.costs.kneel.getPrintedCost())
            },
            message: {
                format: "{player} uses {source} and kneels {costs.kneel} to put {target} into play from {owner}'s discard pile",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

WeTakeWesteros.code = '17109';

export default WeTakeWesteros;
