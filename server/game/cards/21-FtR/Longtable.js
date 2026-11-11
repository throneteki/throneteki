import DrawCard from '../../drawcard.js';

class Longtable extends DrawCard {
    // Longtable (21023)
    // Each Small Council character you control gets +1 STR.
    // Reduce the cost of the first Small Council or Spy character you marshal, ambush, or bring out
    // of shadows each phase by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.hasTrait('Small Council') && card.controller === context.source.controller,
            effect: ability.effects.modifyStrength(1)
        });

        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstCardCostEachPhase(
                ['marshal', 'ambush', 'outOfShadows'],
                1,
                (card) => card.hasTrait('Small Council') || card.hasTrait('Spy')
            )
        });
    }
}

Longtable.code = '21023';

export default Longtable;
