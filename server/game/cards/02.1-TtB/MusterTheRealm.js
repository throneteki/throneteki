import PlotCard from '../../plotcard.js';

class MusterTheRealm extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasAttackingArmy(),
            match: this,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasAttackingArmy() {
        return this.controller.anyCardsInPlay(
            (card) => card.isAttacking() && card.hasTrait('Army')
        );
    }
}

MusterTheRealm.code = '02019';

export default MusterTheRealm;
