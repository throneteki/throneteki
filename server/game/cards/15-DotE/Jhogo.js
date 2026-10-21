import DrawCard from '../../drawcard.js';

class Jhogo extends DrawCard {
    // Jhogo (15007)
    // Reaction: After you win a [military] challenge in which you control 2 or more attacking
    // Dothraki characters, move 1 power from the losing opponent's faction card to your own.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    this.getNumberOfAttackingDothrakis() >= 2
            },
            handler: (context) => {
                let otherPlayer = context.event.challenge.loser;
                this.game.movePower(otherPlayer.faction, this.controller.faction, 1);

                this.game.addMessage(
                    "{0} uses {1} to move 1 power from {2}'s faction to their own",
                    this.controller,
                    this,
                    otherPlayer
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

Jhogo.code = '15007';

export default Jhogo;
