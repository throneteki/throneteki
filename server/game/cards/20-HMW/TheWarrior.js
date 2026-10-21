import PlotCard from '../../plotcard.js';

class TheWarrior extends PlotCard {
    // The Warrior (20060)
    // During a challenge in which you control an attacking The Seven character, raise the claim
    // value on The Warrior by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasAttackingSeven(),
            match: this,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasAttackingSeven() {
        return this.controller.anyCardsInPlay(
            (card) => card.isAttacking() && card.hasTrait('The Seven')
        );
    }
}

TheWarrior.code = '20060';

export default TheWarrior;
