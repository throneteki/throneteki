import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function getNumberOfAttackingDothrakis(source) {
    let cards = source.controller.filterCardsInPlay((card) => {
        return card.isAttacking() && card.hasTrait('Dothraki') && card.getType() === 'character';
    });

    return cards.length;
}

class Rakharo extends DrawCard {
    // Rakharo (15009)
    // Reaction: After you win a [military] challenge in which you control 2 or more attacking
    // Dothraki characters, discard 1 card at random from the losing opponent's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'military' &&
                    getNumberOfAttackingDothrakis(context.source) >= 2
            },
            message: {
                format: "{player} uses {source} to discard 1 card at random from {loser}'s hand",
                args: { loser: (context) => context.game.currentChallenge.loser }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.game.currentChallenge.loser,
                amount: 1
            }))
        });
    }
}

Rakharo.code = '15009';

export default Rakharo;
