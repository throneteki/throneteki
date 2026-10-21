import DrawCard from '../../drawcard.js';

class GreenAppleKnight extends DrawCard {
    // Green-Apple Knight (09012)
    // Green-Apple Knight gets +1 STR for each other Knight character you control.
    // While you control 2 or more other Knight characters, Green-Apple Knight does not kneel when
    // declared as an attacker.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getNumberOfOtherKnights())
        });
        this.persistentEffect({
            condition: () => this.getNumberOfOtherKnights() >= 2,
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    getNumberOfOtherKnights() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card !== this && card.getType() === 'character' && card.hasTrait('Knight')
        );
    }
}

GreenAppleKnight.code = '09012';

export default GreenAppleKnight;
