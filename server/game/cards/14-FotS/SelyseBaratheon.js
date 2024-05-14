import DrawCard from '../../drawcard.js';

class SelyseBaratheon extends DrawCard {
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
