const DrawCard = require('../../drawcard.js');

class SerDenysMallister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

SerDenysMallister.code = '07007';

module.exports = SerDenysMallister;
