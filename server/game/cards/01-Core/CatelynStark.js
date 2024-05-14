import DrawCard from '../../drawcard.js';

class CatelynStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetController: 'opponent',
            effect: ability.effects.cannotTriggerCardAbilities()
        });
    }
}

CatelynStark.code = '01143';

export default CatelynStark;
