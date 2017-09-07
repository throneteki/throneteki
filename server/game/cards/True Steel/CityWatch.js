const DrawCard = require('../../../drawcard.js');

class CityWatch extends DrawCard {

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () =>
                this.game.getOtherPlayer(this.controller)
                && this.controller.faction.power > this.game.getOtherPlayer(this.controller).faction.power,
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', 2)
        });
    }

}

CityWatch.code = '02108';

module.exports = CityWatch;
