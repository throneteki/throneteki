import DrawCard from '../../drawcard.js';

class FleetFromPyke extends DrawCard {
    // Fleet From Pyke (10027)
    // No attachments. Pillage.
    // Reaction: After a character you control discards a location or attachment using pillage,
    // Fleet From Pyke gains a challenge icon of your choice until the end of the phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage &&
                    event.source.controller === this.controller &&
                    ['location', 'attachment'].includes(event.card.getType())
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: this,
                        effect: ability.effects.addIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} gains {1} {2} icon on {3}',
                        context.player,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        this
                    );
                });
            }
        });
    }
}

FleetFromPyke.code = '10027';

export default FleetFromPyke;
