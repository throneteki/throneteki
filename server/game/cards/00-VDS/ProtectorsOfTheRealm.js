const AgendaCard = require('../../agendacard.js');

class ProtectorsOfTheRealm extends AgendaCard {
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
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to give {2} renown until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('renown')
                }));
            }
        });
    }
}

ProtectorsOfTheRealm.code = '00002';

module.exports = ProtectorsOfTheRealm;
