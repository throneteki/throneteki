import DrawCard from '../../drawcard.js';

class CityWatch extends DrawCard {
    // City Watch (02108)
    // Ambush (6). No attachments except Weapon.
    // While you have more power on your faction card than an opponent, reduce the cost to ambush
    // City Watch by 2.
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
