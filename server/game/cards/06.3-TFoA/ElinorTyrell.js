import DrawCard from '../../drawcard.js';

class ElinorTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyMaxLimited(1)
        });
    }
}

ElinorTyrell.code = '06043';

export default ElinorTyrell;
