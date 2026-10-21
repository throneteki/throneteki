import DrawCard from '../../drawcard.js';

class LonelyLight extends DrawCard {
    // Lonely Light (26104)
    // While Lonely Light is standing, increase the cost for each player to bring cards out of
    // shadows by 1.
    // +1 Reserve.
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
