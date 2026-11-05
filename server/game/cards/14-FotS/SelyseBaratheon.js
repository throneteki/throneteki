import DrawCard from '../../drawcard.js';

class SelyseBaratheon extends DrawCard {
    // Selyse Baratheon (14008)
    // Reduce the cost of each R'hllor attachment you marshal by 3.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshal',
                amount: 3,
                match: (card) => card.getType() === 'attachment' && card.hasTrait("R'hllor")
            })
        });
    }
}

SelyseBaratheon.code = '14008';

export default SelyseBaratheon;
