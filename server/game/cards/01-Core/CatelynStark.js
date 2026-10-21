import DrawCard from '../../drawcard.js';

class CatelynStark extends DrawCard {
    // Catelyn Stark (01143)
    // While Catelyn Stark is participating in a challenge, your opponents cannot trigger card
    // abilities.
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
