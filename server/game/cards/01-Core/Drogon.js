import DrawCard from '../../drawcard.js';

class Drogon extends DrawCard {
    // Drogon (01161)
    // No attachments.
    // Each Stormborn character you control gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

Drogon.code = '01161';

export default Drogon;
