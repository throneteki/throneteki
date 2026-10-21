import DrawCard from '../../drawcard.js';

class LockedAway extends DrawCard {
    // Locked Away (06116)
    // Terminal.
    // Reaction: After the marshaling phase begins, return attached character to its owner's hand
    // (cannot be saved).
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'marshal'
            },
            handler: () => {
                this.parent.owner.returnCardToHand(this.parent, false);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    this.controller,
                    this,
                    this.parent,
                    this.parent.owner
                );
            }
        });
    }
}

LockedAway.code = '06116';

export default LockedAway;
