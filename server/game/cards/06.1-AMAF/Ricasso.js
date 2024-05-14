const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class Ricasso extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.dynamicUsedPlots(() => this.tokens[Tokens.gold])
        });
    }
}

Ricasso.code = '06015';

module.exports = Ricasso;
