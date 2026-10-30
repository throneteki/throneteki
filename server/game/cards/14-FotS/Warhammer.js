import DrawCard from '../../drawcard.js';

class Warhammer extends DrawCard {
    // Warhammer (14022)
    // If attached character's printed STR is 4 or lower, it gets +2 STR.
    // If attached character's printed STR is 5 or higher, it gains intimidate.
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.getPrintedStrength() <= 4,
            effect: ability.effects.modifyStrength(2)
        });

        this.whileAttached({
            match: (card) => card.getPrintedStrength() >= 5,
            effect: ability.effects.addKeyword('Intimidate')
        });
    }
}

Warhammer.code = '14022';

export default Warhammer;
