const DrawCard = require('../../drawcard.js');

class FleetFromPyke extends DrawCard {
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

module.exports = FleetFromPyke;
