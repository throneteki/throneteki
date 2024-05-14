import DrawCard from '../../drawcard.js';

class SerJaremyRykker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card !== this && card.hasTrait('Ranger') && card.getType() === 'character',
            effect: ability.effects.addIcon('power')
        });
    }
}

SerJaremyRykker.code = '07008';

export default SerJaremyRykker;
