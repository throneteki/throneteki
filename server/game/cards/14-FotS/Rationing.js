import PlotCard from '../../plotcard.js';

class Rationing extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotTriggerCardAbilities(
                (ability) =>
                    ability.eventType === 'reaction' && ability.triggersFor('afterChallenge')
            )
        });
    }
}

Rationing.code = '14049';

export default Rationing;
