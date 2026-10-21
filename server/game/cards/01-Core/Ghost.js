import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Ghost extends DrawCard {
    // Ghost (01123)
    // No attachments. Stealth.
    // Reaction: After Ghost bypasses a character using stealth, that character cannot be declared
    // as a defender for any challenges until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: (event, context) => event.source === context.source
            },
            message: {
                format: '{player} uses {source} to make {eventTarget} unable to be declared as a defender until the end of the phase',
                args: { eventTarget: (context) => context.event.target }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.event.target,
                effect: ability.effects.cannotBeDeclaredAsDefender()
            }))
        });
    }
}

Ghost.code = '01123';

export default Ghost;
