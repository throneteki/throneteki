import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class FleetFromPyke extends DrawCard {
    // Fleet From Pyke (10027)
    // No attachments. Pillage.
    // Reaction: After a character you control discards a location or attachment using pillage,
    // Fleet From Pyke gains a challenge icon of your choice until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source.controller === context.source.controller &&
                    ['location', 'attachment'].includes(event.card.getType())
            },
            gameAction: GameActions.chooseIcon({
                message: '{player} gains {icon} icon on {source}',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.source,
                        effect: ability.effects.addIcon(icon)
                    }))
            })
        });
    }
}

FleetFromPyke.code = '10027';

export default FleetFromPyke;
