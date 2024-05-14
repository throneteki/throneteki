const AgendaCard = require('../../agendacard');

class KingdomOfShadows extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        card.isFaction(this.controller.faction.getPrintedFaction())
                ),
            targetController: 'current',
            effect: ability.effects.increaseCost({
                playingTypes: 'marshalIntoShadows',
                amount: 1
            })
        });
    }
}

KingdomOfShadows.code = '17148';

module.exports = KingdomOfShadows;
