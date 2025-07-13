import DrawCard from '../../drawcard.js';

class HouseUmberBerserkers extends DrawCard {
    setupCardAbilities() {
        this.xValue({ value: (context) => Math.max(context.player.getNumberOfUsedPlots(), 1) });
    }
}

HouseUmberBerserkers.code = '26031';

export default HouseUmberBerserkers;
