import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Darkstar extends DrawCard {
    // Darkstar (08055)
    // Stealth.
    // Reaction: After Darkstar bypasses a character using stealth, that character loses a challenge
    // icon of your choice until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: (event, context) => event.source === context.source
            },
            gameAction: GameActions.chooseIcon({
                message: {
                    format: '{player} uses {source} to remove {icon} icon from {eventTarget}',
                    args: { eventTarget: (context) => context.event.target }
                },
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.event.target,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

Darkstar.code = '08055';

export default Darkstar;
