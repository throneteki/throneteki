import DrawCard from '../../drawcard.js';

class Penny extends DrawCard {
    // Penny (11029)
    // Shadow (1).
    // While you control more cards in shadows than each opponent, Penny gains an [intrigue] icon
    // and stealth.
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
