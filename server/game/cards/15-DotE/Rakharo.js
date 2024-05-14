import DrawCard from '../../drawcard.js';

class Rakharo extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    this.getNumberOfAttackingDothrakis() >= 2
            },
            handler: () => {
                let loser = this.game.currentChallenge.loser;
                loser.discardAtRandom(1);

                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from {2}'s hand",
                    this.controller,
                    this,
                    loser
                );
            }
        });
    }

    getNumberOfAttackingDothrakis() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return (
                card.isAttacking() && card.hasTrait('Dothraki') && card.getType() === 'character'
            );
        });

        return cards.length;
    }
}

Rakharo.code = '15009';

export default Rakharo;
