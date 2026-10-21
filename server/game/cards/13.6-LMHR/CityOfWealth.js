import PlotCard from '../../plotcard.js';

class CityOfWealth extends PlotCard {
    // City of Wealth (13119)
    // Increase the gold, initiative, and reserve values on this plot card by 1 for each City plot
    // card in your used pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.modifyGold(() => this.numOfCityPlots()),
                ability.effects.modifyInitiative(() => this.numOfCityPlots()),
                ability.effects.modifyReserve(() => this.numOfCityPlots())
            ]
        });
    }

    numOfCityPlots() {
        return this.controller.getNumberOfUsedPlotsByTrait('City');
    }
}

CityOfWealth.code = '13119';

export default CityOfWealth;
