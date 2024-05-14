import DrawCard from '../../drawcard.js';

class RaidingKhalasar extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking() && this.bloodriderIsAttacking(),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    bloodriderIsAttacking() {
        return this.controller.anyCardsInPlay(
            (card) => card.isAttacking() && card.hasTrait('Bloodrider')
        );
    }
}

RaidingKhalasar.code = '08113';

export default RaidingKhalasar;
