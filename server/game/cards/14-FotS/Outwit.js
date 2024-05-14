import PlotCard from '../../plotcard.js';

class Outwit extends PlotCard {
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
