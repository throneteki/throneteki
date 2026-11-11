import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GunthorSonOfGurn extends DrawCard {
    // Gunthor Son of Gurn (12027)
    // Ambush (4).
    // Reaction: After you win a challenge in which Gunthor Son of Gurn is attacking, the losing
    // opponent must choose and discard 1 card from his or her hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.attackingPlayer === context.player &&
                    event.challenge.winner === context.player &&
                    context.source.isAttacking()
            },
            message: {
                format: '{player} uses {source} to have {loser} choose and discard 1 card from their hand',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.challenge.loser,
                title: 'Select a card to discard',
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.discardCard({ card })
            })
        });
    }
}

GunthorSonOfGurn.code = '12027';

export default GunthorSonOfGurn;
