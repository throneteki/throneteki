import DrawCard from '../../drawcard.js';

class Darkstar extends DrawCard {
    // Darkstar (08055)
    // Stealth.
    // Reaction: After Darkstar bypasses a character using stealth, that character loses a challenge
    // icon of your choice until the end of the phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event) => event.source === this
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.event.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to remove {2} {3} icon from {4}',
                        context.player,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.event.target
                    );
                });
            }
        });
    }
}

Darkstar.code = '08055';

export default Darkstar;
