import DrawCard from '../../drawcard.js';

class RaffTheSweetling extends DrawCard {
    // Raff the Sweetling (08049)
    // Pillage.
    // Reaction: After Raff the Sweetling discards a character using pillage, choose a character
    // with printed cost 2 or lower and return it to its owner’s hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage && event.source === this && event.card.getType() === 'character'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 2,
                gameAction: 'returnToHand'
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

RaffTheSweetling.code = '08049';

export default RaffTheSweetling;
