import DrawCard from '../../drawcard.js';

class WarriorsSons extends DrawCard {
    // Warrior's Sons (08077)
    // No attachments.
    // Reaction: After an opponent plays an event during a challenge in which Warrior’s Sons is
    // participating, move 1 power from that opponent’s faction card to Warrior’s Sons.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: (event) =>
                    event.player !== this.controller &&
                    this.isParticipating() &&
                    event.player.faction.power > 0
            },
            handler: (context) => {
                this.game.movePower(context.event.player.faction, this, 1);
                this.game.addMessage(
                    "{0} moves 1 power from {1}'s faction card to {2}",
                    context.player,
                    context.event.player,
                    this
                );
            }
        });
    }
}

WarriorsSons.code = '08077';

export default WarriorsSons;
