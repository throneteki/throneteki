import DrawCard from '../../drawcard.js';

class OldCaptain extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: this,
            effect: [ability.effects.addKeyword('pillage'), ability.effects.addKeyword('renown')]
        });
    }
}

OldCaptain.code = '25024';

export default OldCaptain;
