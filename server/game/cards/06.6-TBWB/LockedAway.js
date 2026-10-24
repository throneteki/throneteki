import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LockedAway extends DrawCard {
    // Locked Away (06116)
    // Terminal.
    // Reaction: After the marshaling phase begins, return attached character to its owner's hand
    // (cannot be saved).
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'marshal' && !!context.source.parent
            },
            message: {
                format: "{player} uses {source} to return {parent} to its owner's hand",
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.returnCardToHand((context) => ({
                card: context.source.parent,
                allowSave: false
            }))
        });
    }
}

LockedAway.code = '06116';

export default LockedAway;
