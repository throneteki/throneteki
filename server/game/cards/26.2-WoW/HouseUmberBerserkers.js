import DrawCard from '../../drawcard.js';

class HouseUmberBerserkers extends DrawCard {
    setupCardAbilities() {
        this.xValue({ value: () => Math.max(this.controller.getNumberOfUsedPlots(), 1) });
    }
}

HouseUmberBerserkers.code = '26031';

export default HouseUmberBerserkers;
