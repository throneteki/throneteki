import DrawCard from '../../drawcard.js';

class OldCaptain extends DrawCard {
    // Old Captain (25024)
    // While Old Captain is standing, it gains pillage and renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            match: this,
            effect: [ability.effects.addKeyword('pillage'), ability.effects.addKeyword('renown')]
        });
    }
}

OldCaptain.code = '25024';

export default OldCaptain;
