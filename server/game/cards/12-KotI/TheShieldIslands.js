const DrawCard = require('../../drawcard');

class TheShieldIslands extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });
    }
}

TheShieldIslands.code = '12038';

module.exports = TheShieldIslands;
