import DrawCard from '../../drawcard.js';

class HornHillVanguard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: this,
            effect: ability.effects.dynamicStrength(() =>
                this.controller.getNumberOfCardsInPlay({
                    faction: 'tyrell',
                    type: 'character',
                    kneeled: false
                })
            )
        });
    }
}

HornHillVanguard.code = '26035';

export default HornHillVanguard;
