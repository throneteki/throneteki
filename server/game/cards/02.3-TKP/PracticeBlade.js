import DrawCard from '../../drawcard.js';

class PracticeBlade extends DrawCard {
    // Practice Blade (02046)
    // [thenightswatch] character only. Ambush (2).
    // Attached character gets +1 STR and gains a [military] icon.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.whileAttached({
            effect: [ability.effects.modifyStrength(1), ability.effects.addIcon('military')]
        });
    }
}

PracticeBlade.code = '02046';

export default PracticeBlade;
