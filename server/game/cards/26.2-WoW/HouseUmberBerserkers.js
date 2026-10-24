import DrawCard from '../../drawcard.js';

class HouseUmberBerserkers extends DrawCard {
    // House Umber Berserkers (26031)
    // Assault. No attachments. Shadow (X).
    // X is the number of plot cards in your used pile (minimum of 1).
    setupCardAbilities() {
        this.xValue({ value: (context) => Math.max(context.player.getNumberOfUsedPlots(), 1) });
    }
}

HouseUmberBerserkers.code = '26031';

export default HouseUmberBerserkers;
