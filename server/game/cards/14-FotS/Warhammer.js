import DrawCard from '../../drawcard.js';

class Warhammer extends DrawCard {
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
