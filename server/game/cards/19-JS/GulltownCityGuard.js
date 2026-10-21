import DrawCard from '../../drawcard.js';

class GulltownCityGuard extends DrawCard {
    // Gulltown City Guard (19017)
    // No attachments except Weapon.
    // Reduce the cost to marshal Gulltown City Guard by 1 for each City plot card in your used pile
    // (to a minimum of 1).
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
