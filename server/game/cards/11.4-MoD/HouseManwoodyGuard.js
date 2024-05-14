import DrawCard from '../../drawcard.js';

class HouseManwoodyGuard extends DrawCard {
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
