import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHalfmansHorde extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            message: {
                format: "{player} uses {source} to discard {number} cards at random from {loser}'s hand",
                args: {
                    number: (context) => this.getNumberToDiscard(context.event.challenge.winner),
                    loser: (context) => context.event.challenge.loser
                }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.event.challenge.loser,
                amount: this.getNumberToDiscard(context.event.challenge.winner)
            }))
        });
    }

    getNumberToDiscard(player) {
        return player.getNumberOfCardsInPlay(
            (card) =>
                card !== this &&
                card.isUnique() &&
                card.isAttacking() &&
                card.hasTrait('Clansman') &&
                card.getType() === 'character'
        );
    }
}

TheHalfmansHorde.code = '23005';

export default TheHalfmansHorde;
