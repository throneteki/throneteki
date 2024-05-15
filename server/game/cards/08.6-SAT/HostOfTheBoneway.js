import DrawCard from '../../drawcard.js';

class HostOfTheBoneway extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.controller.getNumberOfUsedPlots())
        });
    }
}

HostOfTheBoneway.code = '08115';

export default HostOfTheBoneway;
