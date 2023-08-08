const DrawCard = require('../../drawcard.js');

class SeptaUnella extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: card => !card.hasTrait('The Seven') && card.getType() === 'character' && card.power > 0,
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

SeptaUnella.code = '25599';
SeptaUnella.version = '1.0';

module.exports = SeptaUnella;
