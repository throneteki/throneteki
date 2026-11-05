import PlotCard from '../../plotcard.js';

class StrikingAtDawn extends PlotCard {
    // Striking at Dawn (26039)
    // Each character's STR cannot be increased or reduced by card effects.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character',
            targetController: 'any',
            effect: [
                ability.effects.cannotDecreaseStrength(
                    (context) => context.resolutionStage === 'effect'
                ),
                ability.effects.cannotIncreaseStrength(
                    (context) => context.resolutionStage === 'effect'
                )
            ]
        });
    }
}

StrikingAtDawn.code = '26039';

export default StrikingAtDawn;
