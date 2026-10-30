import PlotCard from '../../plotcard.js';

function numOfCityPlots(source) {
    return source.controller.getNumberOfUsedPlotsByTrait('City');
}

class CityOfWealth extends PlotCard {
    // City of Wealth (13119)
    // Increase the gold, initiative, and reserve values on this plot card by 1 for each City plot
    // card in your used pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.modifyGold((card, context) => numOfCityPlots(context.source)),
                ability.effects.modifyInitiative((card, context) => numOfCityPlots(context.source)),
                ability.effects.modifyReserve((card, context) => numOfCityPlots(context.source))
            ]
        });
    }
}

CityOfWealth.code = '13119';

export default CityOfWealth;
