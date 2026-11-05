import DrawCard from '../../drawcard.js';

class Harlaw extends DrawCard {
    // Harlaw (19003)
    // Reduce the reserve value on each opponent's revealed plot card by 1.
    // Reduce the cost of each House Harlaw card you marshal by 1.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyReserve(-1)
        });
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshal',
                amount: 1,
                match: (card) => card.hasTrait('House Harlaw')
            })
        });
        this.plotModifiers({
            reserve: 1
        });
    }
}

Harlaw.code = '19003';

export default Harlaw;
