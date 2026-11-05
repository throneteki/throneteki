import PlotCard from '../../plotcard.js';

class SnowedUnder extends PlotCard {
    // Snowed Under (03048)
    // Treat the base initiative value on each revealed plot card as if it were 0.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.controller.activePlot === card,
            targetController: 'any',
            effect: ability.effects.setBaseInitiative(0)
        });
    }
}

SnowedUnder.code = '03048';

export default SnowedUnder;
