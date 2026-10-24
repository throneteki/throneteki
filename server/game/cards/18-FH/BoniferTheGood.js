import DrawCard from '../../drawcard.js';

class BoniferTheGood extends DrawCard {
    // Bonifer the Good (18001)
    // Each non-neutral The Seven character you control gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                !card.isFaction('neutral') &&
                card.hasTrait('The Seven') &&
                card.getType() === 'character',
            effect: ability.effects.addKeyword('insight')
        });
    }
}

BoniferTheGood.code = '18001';

export default BoniferTheGood;
