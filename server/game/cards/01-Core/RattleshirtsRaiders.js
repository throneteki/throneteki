import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RattleshirtsRaiders extends DrawCard {
    // Rattleshirt's Raiders (01030)
    // No attachments.
    // Reaction: After you win a challenge in which Rattleshirt's Raiders is participating as an
    // attacker, choose an attachment controlled by the losing opponent, and discard it from play.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.attackingPlayer === context.source.controller &&
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.loser &&
                    card.getType() === 'attachment'
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

RattleshirtsRaiders.code = '01030';

export default RattleshirtsRaiders;
