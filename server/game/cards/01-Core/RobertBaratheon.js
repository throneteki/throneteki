import DrawCard from '../../drawcard.js';

function calculateStrength(source) {
    return source.game.allCards.reduce((counter, card) => {
        if (
            card === source ||
            card.location !== 'play area' ||
            card.getType() !== 'character' ||
            !card.kneeled
        ) {
            return counter;
        }

        return counter + 1;
    }, 0);
}

class RobertBaratheon extends DrawCard {
    // Robert Baratheon (01048)
    // Intimidate. Renown.
    // Robert Baratheon gets +1 STR for each other kneeling character in play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) =>
                calculateStrength(context.source)
            )
        });
    }
}

RobertBaratheon.code = '01048';

export default RobertBaratheon;
