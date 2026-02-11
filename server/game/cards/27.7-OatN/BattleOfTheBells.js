// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Created plot card that prevents abilities reacting to cards entering play

import PlotCard from '../../plotcard.js';

class BattleOfTheBells extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotTriggerCardAbilities(
                (abilityToCheck) =>
                    ['reaction', 'interrupt'].includes(ability.eventType) &&
                    abilityToCheck.triggersFor('onCardEntersPlay')
            )
        });
    }
}

BattleOfTheBells.code = '27609';
BattleOfTheBells.version = '1.0.0';

export default BattleOfTheBells;
