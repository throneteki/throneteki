import DrawCard from '../../drawcard.js';

class CityWatch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.hasMorePowerThanAnOpponent(),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', 2)
        });
    }

    hasMorePowerThanAnOpponent() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => this.controller.faction.power > opponent.faction.power);
    }
}

CityWatch.code = '02108';

export default CityWatch;
