const DrawCard = require('../../drawcard.js');

class LynCorbray extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                !card.hasTrait('Army') &&
                card.getType() === 'character' &&
                card.getPrintedCost() >= 6,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

LynCorbray.code = '00017';

module.exports = LynCorbray;
