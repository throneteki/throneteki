import AgendaCard from '../../agendacard.js';

class Fealty extends AgendaCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel your faction card',
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.addMessage(
                    '{0} uses {1} to kneel their faction card and reduce the cost of the next loyal card by 1',
                    this.controller,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledOrPlayedCardCost(1, (card) =>
                        card.isLoyal()
                    )
                }));
            }
        });
    }
}

Fealty.code = '01027';

export default Fealty;
