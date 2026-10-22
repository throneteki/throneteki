import DrawCard from '../../drawcard.js';

function hasMorePowerThanAnOpponent(source) {
    let opponents = source.game.getOpponents(source.controller);
    return opponents.some((opponent) => source.controller.faction.power > opponent.faction.power);
}

class CityWatch extends DrawCard {
    // City Watch (02108)
    // Ambush (6). No attachments except Weapon.
    // While you have more power on your faction card than an opponent, reduce the cost to ambush
    // City Watch by 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => hasMorePowerThanAnOpponent(context.source),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', 2)
        });
    }
}

CityWatch.code = '02108';

export default CityWatch;
