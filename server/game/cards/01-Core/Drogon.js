import DrawCard from '../../drawcard.js';

class Drogon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

Drogon.code = '01161';

export default Drogon;
