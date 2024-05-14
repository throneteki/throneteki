import DrawCard from '../../drawcard.js';

class GulltownCityGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: [
                ability.effects.reduceSelfCost('marshal', () => this.numOfCityPlots()),
                ability.effects.setMinCost(1)
            ]
        });
    }

    numOfCityPlots() {
        return this.controller.getNumberOfUsedPlotsByTrait('City');
    }
}

GulltownCityGuard.code = '19017';

export default GulltownCityGuard;
