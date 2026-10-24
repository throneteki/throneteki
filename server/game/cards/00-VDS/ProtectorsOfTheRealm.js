import GameActions from '../../GameActions/index.js';
import AgendaCard from '../../agendacard.js';

class ProtectorsOfTheRealm extends AgendaCard {
    // Protectors of the Realm (00002)
    // You may include Knight and Army characters from any faction in your deck.
    // Action: Kneel your faction card to choose a Knight or Army character. Until the end of the
    // phase, that character gains renown.
    // Draft format only.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give Knight or Army renown',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Knight') || card.hasTrait('Army'))
            },
            message:
                '{player} uses {source} and kneels their faction card to give {target} renown until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('renown')
            }))
        });
    }
}

ProtectorsOfTheRealm.code = '00002';

export default ProtectorsOfTheRealm;
