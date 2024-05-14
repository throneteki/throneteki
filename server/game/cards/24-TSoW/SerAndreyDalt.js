import DrawCard from '../../drawcard.js';

class SerAndreyDalt extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.cannotGainDominancePower()
        });
    }
}

SerAndreyDalt.code = '24010';

export default SerAndreyDalt;
