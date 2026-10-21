import DrawCard from '../../drawcard.js';

class QuaitheOfTheShadow extends DrawCard {
    // Quaithe of the Shadow (04113)
    // Ambush (3).
    // Reaction: After Quaithe of the Shadow enters play during a challenge, remove each character
    // with STR 2 or lower from the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this &&
                    this.game.isDuringChallenge() &&
                    this.game.currentPhase === 'challenge'
            },
            handler: () => {
                let attackers = this.game.currentChallenge.attackers.filter(
                    (card) => card.getStrength() <= 2
                );
                let defenders = this.game.currentChallenge.defenders.filter(
                    (card) => card.getStrength() <= 2
                );
                let participants = attackers.concat(defenders);
                for (let card of participants) {
                    this.game.currentChallenge.removeFromChallenge(card);
                }

                this.game.addMessage(
                    '{0} uses {1} to remove all characters with STR 2 or lower from the challenge',
                    this.controller,
                    this
                );
            }
        });
    }
}

QuaitheOfTheShadow.code = '04113';

export default QuaitheOfTheShadow;
