const AgendaCard = require('../../agendacard');

class BannerOfTheFalcon extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getOpponents(this.controller).every(player => player.getTotalInitiative() > this.controller.getTotalInitiative()),
            match: card => card.hasTrait('House Arryn') && card.getType() === 'character' && card.controller === this.controller,
            effect: ability.effects.modifyStrength(1)
        });
    }
}

BannerOfTheFalcon.code = '23040';

module.exports = BannerOfTheFalcon;
