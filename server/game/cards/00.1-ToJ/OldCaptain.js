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

OldCaptain.code = '00145';

export default OldCaptain;
