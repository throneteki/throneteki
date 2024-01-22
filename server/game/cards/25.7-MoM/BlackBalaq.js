const { Tokens } = require('../../Constants/index.js');
const DrawCard = require('../../drawcard.js');

class BlackBalaq extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: card => card.isDefending(),
            targetController: 'opponent',
            effect: ability.effects.dynamicStrength(() => -this.tokens[Tokens.gold])
        });
    }
}

BlackBalaq.code = '25575';
BlackBalaq.version = '1.0';

module.exports = BlackBalaq;
