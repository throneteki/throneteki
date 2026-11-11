import PlotCard from '../../plotcard.js';

class SneakAttack extends PlotCard {
    // Sneak Attack (01021)
    // You cannot initiate more than 1 challenge during the challenges phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.setMaxChallenge(1)
        });
    }
}

SneakAttack.code = '01021';

export default SneakAttack;
