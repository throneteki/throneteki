import DrawCard from '../../drawcard.js';

class HouseUmberBerserkers extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: [
                // TODO: Fix Shadow (X)
                ability.effects.addKeyword('Shadow (0)') //,
                // ability.effects.increaseCost({
                //     playingTypes: ['outOfShadows'],
                //     amount: () => Math.max(this.controller.getNumberOfUsedPlots(), 1),
                //     match: this
                // })
            ]
        });
    }
}

HouseUmberBerserkers.code = '26031';

export default HouseUmberBerserkers;
