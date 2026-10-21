import DrawCard from '../../drawcard.js';

class StannisBaratheon extends DrawCard {
    // Stannis Baratheon (01052)
    // Each player cannot stand more than 2 characters during the standing phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotStandMoreThan(2, (card) => card.getType() === 'character')
        });
    }
}

StannisBaratheon.code = '01052';

export default StannisBaratheon;
