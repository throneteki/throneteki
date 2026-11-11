import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WarriorsSons extends DrawCard {
    // Warrior's Sons (25045)
    // No attachments.
    // Reaction: After power is gained by or moved to Warrior's Sons, stand Warrior's Sons. (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) => event.card === context.source,
                onCardPowerMoved: (event, context) => event.target === context.source
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({
                card: context.event.card || context.event.target
            }))
        });
    }
}

WarriorsSons.code = '25045';

export default WarriorsSons;
