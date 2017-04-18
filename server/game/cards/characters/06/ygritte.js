const DrawCard = require('../../../drawcard.js');

class Ygritte extends DrawCard {
    setupCardAbilities(ability) {
        // TODO: Cannot be knelt by card effects.
        this.persistentEffect({
            condition: () => this.controlsAnotherWildling(),
            match: this,
            effects: ability.effects.addKeyword('stealth')
        });
    }

    controlsAnotherWildling() {
        return this.controller.cardsInPlay.any(card => card.hasTrait('Wildling') && card.getType() === 'character' && card !== this);
    }
}

Ygritte.code = '06017';

module.exports = Ygritte;
