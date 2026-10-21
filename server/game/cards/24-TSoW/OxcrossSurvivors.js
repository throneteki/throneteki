import DrawCard from '../../drawcard.js';

class OxcrossSurvivors extends DrawCard {
    // Oxcross Survivors (24008)
    // No attachments.
    // While you control a [lannister] Lord or Commander character, Oxcross Survivors gets +3 STR
    // and gains assault.
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

export default OxcrossSurvivors;
