import DrawCard from '../../drawcard.js';

class PlankyTownTrader extends DrawCard {
    // Planky Town Trader (08075)
    // Bestow (5).
    // Interrupt: When Planky Town Trader leaves play, put a non-[martell] character with printed
    // cost X or lower into play from your hand. X is the number of gold on Planky Town Trader.
    // Until the end of the phase, that character cannot leave play.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    !card.isFaction('martell') &&
                    card.getPrintedCost() <= this.tokens.gold
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play from their hand',
                    context.player,
                    this,
                    context.target
                );

                //"Cannot leave play" is not possible at the moment, so these are the general ways
                //through which cards leave play instead
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.cannotBeKilled(),
                        ability.effects.cannotBeDiscarded(),
                        ability.effects.cannotBePutIntoShadows(),
                        ability.effects.cannotBeRemovedFromGame(),
                        ability.effects.cannotBeReturnedToHand(),
                        ability.effects.cannotBeSacrificed(),
                        ability.effects.cannotBeReturnedToDeck()
                    ]
                }));

                this.game.addMessage(
                    'Until the end of the phase, {0} cannot leave play',
                    context.target
                );
            }
        });
    }
}

PlankyTownTrader.code = '08075';

export default PlankyTownTrader;
