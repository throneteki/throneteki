import DrawCard from '../../drawcard.js';

class Penny extends DrawCard {
    // Penny (11029)
    // Shadow (1).
    // While you control more cards in shadows than each opponent, Penny gains an [intrigue] icon
    // and stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game
                    .getOpponents(context.source.controller)
                    .every(
                        (opponent) =>
                            opponent.shadows.length < context.source.controller.shadows.length
                    ),
            match: this,
            effect: [ability.effects.addIcon('intrigue'), ability.effects.addKeyword('stealth')]
        });
    }
}

Penny.code = '11029';

export default Penny;
