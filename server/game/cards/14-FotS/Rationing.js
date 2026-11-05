import PlotCard from '../../plotcard.js';

class Rationing extends PlotCard {
    // Rationing (14049)
    // Players cannot trigger reactions to winning or losing challenges.
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
