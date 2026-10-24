import PlotCard from '../../plotcard.js';

class AMeetingOfMinds extends PlotCard {
    // A Meeting of Minds (26099)
    // Each Small Council character you control gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('Small Council'),
            targetController: 'current',
            effect: ability.effects.addKeyword('insight')
        });
    }
}

AMeetingOfMinds.code = '26099';

export default AMeetingOfMinds;
