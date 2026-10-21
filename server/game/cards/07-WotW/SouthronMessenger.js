import DrawCard from '../../drawcard.js';

class SouthronMessenger extends DrawCard {
    // Southron Messenger (07031)
    // Ambush (5).
    // Reaction: After Southron Messenger enters play during a challenge, choose a participating
    // character with fewer than 2 challenge icons, and return that character to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.game.isDuringChallenge()
            },
            target: {
                activePromptTitle: 'Select participating character',
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    card.getNumberOfIcons() <= 1
            },
            handler: (context) => {
                context.target.controller.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    context.target,
                    context.target.controller
                );
            }
        });
    }
}

SouthronMessenger.code = '07031';

export default SouthronMessenger;
