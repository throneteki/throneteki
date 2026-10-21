import DrawCard from '../../drawcard.js';

class RattleshirtsRaiders extends DrawCard {
    // Rattleshirt's Raiders (01030)
    // No attachments.
    // Reaction: After you win a challenge in which Rattleshirt's Raiders is participating as an
    // attacker, choose an attachment controlled by the losing opponent, and discard it from play.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking()
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'attachment'
            },
            handler: (context) => {
                context.target.owner.discardCard(context.target);

                this.game.addMessage(
                    '{0} uses {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

RattleshirtsRaiders.code = '01030';

export default RattleshirtsRaiders;
