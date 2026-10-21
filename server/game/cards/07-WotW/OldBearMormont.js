import DrawCard from '../../drawcard.js';

class OldBearMormont extends DrawCard {
    // Old Bear Mormont (07003)
    // Reaction: After you win a challenge in which Old Bear Mormont is participating, choose a
    // non-unique character in the losing opponent's discard pile, and put it into play under your
    // control.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            target: {
                cardCondition: (card, context) =>
                    !card.isUnique() &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser &&
                    card.location === 'discard pile' &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                let originalPlayer = context.target.controller;
                this.controller.putIntoPlay(context.target);

                this.game.addMessage(
                    "{0} uses {1} to put {2} into play under their control from {3}'s discard pile",
                    this.controller,
                    this,
                    context.target,
                    originalPlayer
                );
            }
        });
    }
}

OldBearMormont.code = '07003';

export default OldBearMormont;
