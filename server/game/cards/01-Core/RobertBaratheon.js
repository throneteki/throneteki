import DrawCard from '../../drawcard.js';

class RobertBaratheon extends DrawCard {
    // Robert Baratheon (01048)
    // Intimidate. Renown.
    // Robert Baratheon gets +1 STR for each other kneeling character in play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.calculateStrength()
            )
        });
    }

    calculateStrength() {
        return this.game.allCards.reduce((counter, card) => {
            if (
                card === this ||
                card.location !== 'play area' ||
                card.getType() !== 'character' ||
                !card.kneeled
            ) {
                return counter;
            }

            return counter + 1;
        }, 0);
    }
}

RobertBaratheon.code = '01048';

export default RobertBaratheon;
