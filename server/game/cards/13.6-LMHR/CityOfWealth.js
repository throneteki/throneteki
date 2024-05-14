import PlotCard from '../../plotcard.js';

class CityOfWealth extends PlotCard {
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
