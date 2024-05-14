import DrawCard from '../../drawcard.js';

class RobertBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength())
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
