import PlotCard from '../../plotcard.js';

class Outwit extends PlotCard {
    // Outwit (14047)
    // Interrupt: When the effects of a when revealed ability would initiate, kneel your faction
    // card and a unique Maester character to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) => event.ability.eventType === 'whenrevealed'
            },
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.kneel(
                    (card) =>
                        card.getType() === 'character' &&
                        card.hasTrait('Maester') &&
                        card.isUnique()
                )
            ],
            message: {
                format: '{player} uses {source}, kneels their faction card, and kneels {kneeledCard} to cancel {plot}',
                args: {
                    kneeledCard: (context) => context.costs.kneel,
                    plot: (context) => context.event.source
                }
            },
            handler: (context) => {
                context.event.cancel();
            }
        });
    }
}

Outwit.code = '14047';

export default Outwit;
