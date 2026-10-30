import PlotCard from '../../plotcard.js';

class RainsOfAutumn extends PlotCard {
    // Rains of Autumn (04019)
    // Characters and locations do not provide positive gold modifiers.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.printedPlotModifiers.gold &&
                (card.getType() === 'character' || card.getType() === 'location'),
            targetController: 'any',
            effect: ability.effects.preventPlotModifier('gold')
        });
    }
}

RainsOfAutumn.code = '04019';

export default RainsOfAutumn;
