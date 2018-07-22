const DrawCard = require('../../drawcard.js');

class Ricasso extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.dynamicUsedPlots(() => this.tokens['gold'])
        });
    }
}

Ricasso.code = '06015';

module.exports = Ricasso;
