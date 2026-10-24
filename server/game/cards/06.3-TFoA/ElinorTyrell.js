import DrawCard from '../../drawcard.js';

class ElinorTyrell extends DrawCard {
    // Elinor Tyrell (06043)
    // You may marshal or play 1 additional limited card each round.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyMaxLimited(1)
        });
    }
}

ElinorTyrell.code = '06043';

export default ElinorTyrell;
