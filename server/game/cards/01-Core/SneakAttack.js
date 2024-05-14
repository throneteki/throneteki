import PlotCard from '../../plotcard.js';

class SneakAttack extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.setMaxChallenge(1)
        });
    }
}

SneakAttack.code = '01021';

export default SneakAttack;
