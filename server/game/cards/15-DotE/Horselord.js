import DrawCard from '../../drawcard.js';

class Horselord extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });
    }

    getSTR() {
        let cards = this.controller.filterCardsInPlay(
            (card) => card.isAttacking() && card.hasTrait('Dothraki') && card !== this
        );
        return cards.length;
    }
}

Horselord.code = '15015';

export default Horselord;
