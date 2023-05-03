const DrawCard = require('../../drawcard.js');

class SerGilbertFarring extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay({ trait: 'Stronghold', type: 'location' }),
            match: this,
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.doesNotKneelAsDefender()
            ]
        });
    }
}

SerGilbertFarring.code = '24002';

module.exports = SerGilbertFarring;
