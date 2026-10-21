import DrawCard from '../../drawcard.js';

class TheGodsEye extends DrawCard {
    // The God's Eye (04058)
    // The God's Eye cannot be discarded from play.
    // +1 Income.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeDiscarded()
        });

        this.plotModifiers({
            reserve: 1,
            gold: 1
        });
    }
}

TheGodsEye.code = '04058';

export default TheGodsEye;
