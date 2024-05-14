import DrawCard from '../../drawcard.js';

class TheGodsEye extends DrawCard {
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
