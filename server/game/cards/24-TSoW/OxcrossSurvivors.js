const DrawCard = require('../../drawcard.js');

class OxcrossSurvivors extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay({
                    faction: 'lannister',
                    type: 'character',
                    trait: ['Lord', 'Commander']
                }),
            match: this,
            effect: [ability.effects.modifyStrength(3), ability.effects.addKeyword('Assault')]
        });
    }
}

OxcrossSurvivors.code = '24008';

module.exports = OxcrossSurvivors;
