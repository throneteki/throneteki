const TitleCard = require('../../TitleCard.js');

class CrownRegent extends TitleCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyDominanceStrength(2)
        });
    }
}

CrownRegent.code = '01211';
CrownRegent.TODO = 'Redirect ability';

module.exports = CrownRegent;
