const TitleCard = require('../../TitleCard.js');

class CrownRegent extends TitleCard {
    setupCardAbilities(ability) {
        // TODO: Redirect ability
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyDominanceStrength(2)
        });
    }
}

CrownRegent.code = '01211';

module.exports = CrownRegent;
