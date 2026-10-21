import DrawCard from '../../drawcard.js';

class HornHillVanguard extends DrawCard {
    // Horn Hill Vanguard (26035)
    // Assault. Intimidate. No attachments.
    // While Horn Hill Vanguard is attacking, it gets +1 STR for each standing [tyrell] character
    // you control.
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
