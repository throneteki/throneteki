import DrawCard from '../../drawcard.js';

class APinchOfPowder extends DrawCard {
    // A Pinch of Powder (11099)
    // Shadow (1).
    // Reaction: After you win an [intrigue] or [power] challenge by 5 or more STR as the attacking
    // player, return attached character to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    ['intrigue', 'power'].includes(event.challenge.challengeType)
            },
            handler: (context) => {
                this.parent.controller.returnCardToHand(this.parent, true);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    this.parent,
                    this.parent.controller
                );
            }
        });
    }
}

APinchOfPowder.code = '11099';

export default APinchOfPowder;
