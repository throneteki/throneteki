// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Created plot card that prevents triggering abilities on non-shadow cards

import PlotCard from '../../plotcard.js';

class BeneathTheRedKeep extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotTriggerCardAbilities(
                (ability) =>
                    ['character', 'location', 'attachment'].includes(ability.card.getType()) &&
                    !ability.card.isShadow()
            )
        });
    }
}

BeneathTheRedKeep.code = '27614';
BeneathTheRedKeep.version = '1.0.0';

export default BeneathTheRedKeep;
