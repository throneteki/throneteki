import DrawCard from '../../drawcard.js';

class Longclaw extends DrawCard {
    // Longclaw (01135)
    // [thenightswatch] character only.
    // Attached character gets +1 STR and gains renown.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.whileAttached({
            effect: [ability.effects.modifyStrength(1), ability.effects.addKeyword('Renown')]
        });
    }
}

Longclaw.code = '01135';

export default Longclaw;
