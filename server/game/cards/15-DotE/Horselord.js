import DrawCard from '../../drawcard.js';

class Horselord extends DrawCard {
    // Horselord (15015)
    // While Horselord is attacking, it gets +1 STR for each other attacking Dothraki character you
    // control.
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
