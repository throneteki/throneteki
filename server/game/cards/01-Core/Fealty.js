import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class Fealty extends AgendaCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel your faction card',
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} to kneel their faction card and reduce the cost of the next loyal card they marshal or play this phase by 1',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledOrPlayedCardCost(1, (card) =>
                    card.isLoyal()
                )
            }))
        });
    }
}

Fealty.code = '01027';

export default Fealty;
