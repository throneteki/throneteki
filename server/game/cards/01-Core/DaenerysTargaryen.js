const DrawCard = require('../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: (card) => card.isParticipating() && card.getType() === 'character',
            targetController: 'opponent',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

DaenerysTargaryen.code = '01160';

module.exports = DaenerysTargaryen;
