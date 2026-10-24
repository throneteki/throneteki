import DrawCard from '../../drawcard.js';

class TheIronThrone extends DrawCard {
    // The Iron Throne (01038)
    // The Iron Throne contributes 8 STR to your total for dominance.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyDominanceStrength(8)
        });
    }
}

TheIronThrone.code = '01038';

export default TheIronThrone;
