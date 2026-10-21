import PlotCard from '../../plotcard.js';

class CastMeForth extends PlotCard {
    // Cast Me Forth (25004)
    // You may ambush non-unique Drowned God characters from your dead pile as if they were in your
    // hand.
    // Each Drowned God character in your hand or dead pile gains ambush (X). X is that card's
    // printed cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canAmbush(
                (card) =>
                    card.controller === this.controller &&
                    card.location === 'dead pile' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Drowned God') &&
                    !card.isUnique()
            )
        });
        this.persistentEffect({
            targetLocation: ['hand', 'dead pile'],
            match: (card) => card.hasTrait('Drowned God'),
            effect: ability.effects.gainAmbush()
        });
    }
}

CastMeForth.code = '25004';

export default CastMeForth;
