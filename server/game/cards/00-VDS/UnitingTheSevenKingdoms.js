const AgendaCard = require('../../agendacard.js');

class UnitingTheSevenKingdoms extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.increaseCost({
                playingTypes: ['marshal', 'play'],
                amount: 1,
                match: (card) => card.isOutOfFaction()
            })
        });
    }
}

UnitingTheSevenKingdoms.code = '00004';

module.exports = UnitingTheSevenKingdoms;
