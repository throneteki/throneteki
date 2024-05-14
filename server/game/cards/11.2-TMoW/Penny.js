import DrawCard from '../../drawcard.js';

class Penny extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getOpponents(this.controller)
                    .every((opponent) => opponent.shadows.length < this.controller.shadows.length),
            match: this,
            effect: [ability.effects.addIcon('intrigue'), ability.effects.addKeyword('stealth')]
        });
    }
}

Penny.code = '11029';

export default Penny;
