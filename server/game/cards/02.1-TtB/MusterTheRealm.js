import PlotCard from '../../plotcard.js';

class MusterTheRealm extends PlotCard {
    // Muster the Realm (02019)
    // During a challenge in which you control an attacking Army character, raise the claim value on
    // Muster the Realm by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.hasAttackingArmy(),
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
