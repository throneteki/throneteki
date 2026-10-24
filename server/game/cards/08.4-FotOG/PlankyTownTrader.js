import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class PlankyTownTrader extends DrawCard {
    // Planky Town Trader (08075)
    // Bestow (5).
    // Interrupt: When Planky Town Trader leaves play, put a non-[martell] character with printed
    // cost X or lower into play from your hand. X is the number of gold on Planky Town Trader.
    // Until the end of the phase, that character cannot leave play.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardLeftPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    !card.isFaction('martell') &&
                    card.getPrintedCost() <= (context.source.tokens[Tokens.gold] || 0)
            },
            message:
                '{player} uses {source} to put {target} into play from their hand, and it cannot leave play until the end of the phase',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            })).then({
                // "Cannot leave play" is not an effect yet, so these are the ways a card leaves play.
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.parentContext.target,
                    effect: [
                        ability.effects.cannotBeKilled(),
                        ability.effects.cannotBeDiscarded(),
                        ability.effects.cannotBePutIntoShadows(),
                        ability.effects.cannotBeRemovedFromGame(),
                        ability.effects.cannotBeReturnedToHand(),
                        ability.effects.cannotBeSacrificed(),
                        ability.effects.cannotBeReturnedToDeck()
                    ]
                }))
            })
        });
    }
}

PlankyTownTrader.code = '08075';

export default PlankyTownTrader;
