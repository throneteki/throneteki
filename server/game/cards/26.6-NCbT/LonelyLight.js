import DrawCard from '../../drawcard.js';

class LonelyLight extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });
        this.persistentEffect({
            targetController: 'any',
            condition: () => !this.kneeled,
            effect: ability.effects.increaseCost({
                playingTypes: ['outOfShadows'],
                amount: 1
            })
        });
    }
}

LonelyLight.code = '26104';

export default LonelyLight;
