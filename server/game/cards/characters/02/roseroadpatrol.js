const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class RoseroadPatrol extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasCharacterWithHighestSTR(),
            match: this,
            effect: ability.effects.addKeyword('Stealth')
        });
    }

    hasCharacterWithHighestSTR() {
        let charactersInPlay = this.game.findAnyCardsInPlay(card => card.getType() === 'character');
        let strengths = _.map(charactersInPlay, card => card.getStrength());
        let highestStrength = _.max(strengths);

        return this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.getStrength() >= highestStrength);
    }
}

RoseroadPatrol.code = '02083';

module.exports = RoseroadPatrol;
