const AgendaCard = require('../../agendacard.js');

class UnitingTheSevenKingdoms extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.increaseCost({
                playingTypes: ['marshal', 'play'],
                amount: 1,
                match: card => !card.isFaction(this.controller.getFaction()) && !card.isFaction('neutral')
            })
        });
    }
}

UnitingTheSevenKingdoms.code = '00004';

module.exports = UnitingTheSevenKingdoms;
