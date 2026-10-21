import DrawCard from '../../drawcard.js';

class HouseManwoodyGuard extends DrawCard {
    // House Manwoody Guard (11075)
    // While you are not the first player, each Guard character you control does not kneel when
    // declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.firstPlayer,
            match: (card) => card.getType() === 'character' && card.hasTrait('Guard'),
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

HouseManwoodyGuard.code = '11075';

export default HouseManwoodyGuard;
