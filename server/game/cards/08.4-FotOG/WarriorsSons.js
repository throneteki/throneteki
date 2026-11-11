import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WarriorsSons extends DrawCard {
    // Warrior's Sons (08077)
    // No attachments.
    // Reaction: After an opponent plays an event during a challenge in which Warrior’s Sons is
    // participating, move 1 power from that opponent’s faction card to Warrior’s Sons.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.player !== context.source.controller &&
                    context.source.isParticipating() &&
                    event.player.faction.power > 0
            },
            message: {
                format: "{player} moves 1 power from {eventPlayer}'s faction card to {source}",
                args: { eventPlayer: (context) => context.event.player }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.player.faction,
                to: context.source,
                amount: 1
            }))
        });
    }
}

WarriorsSons.code = '08077';

export default WarriorsSons;
