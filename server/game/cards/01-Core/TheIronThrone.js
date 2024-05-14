import DrawCard from '../../drawcard.js';

class TheIronThrone extends DrawCard {
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
