const DrawCard = require('../../drawcard.js');

class FormerChampion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.power * -1)
        });
        this.persistentEffect({
            condition: () => this.getStrength() <= 3,
            match: this,
            effect: [ability.effects.addIcon('power'), ability.effects.addKeyword('Stealth')]
        });
        this.persistentEffect({
            condition: () => this.getStrength() <= 1,
            match: this,
            effect: [ability.effects.addIcon('intrigue'), ability.effects.addKeyword('Intimidate')]
        });
    }
}

FormerChampion.code = '24026';

module.exports = FormerChampion;
