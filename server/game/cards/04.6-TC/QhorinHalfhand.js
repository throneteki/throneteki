import DrawCard from '../../drawcard.js';

class QhorinHalfhand extends DrawCard {
    // Qhorin Halfhand (04105)
    // Renown. No attachments except Weapon.
    // Reaction: After you win a [military] challenge in which Qhorin Halfhand is participating,
    // choose and kill a non-unique character with lower STR than his controlled by the losing
    // opponent.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    this.isParticipating()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'character' &&
                    !card.isUnique() &&
                    card.getStrength() < this.getStrength(),
                gameAction: 'kill'
            },
            handler: (context) => {
                context.target.controller.killCharacter(context.target);
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

QhorinHalfhand.code = '04105';

export default QhorinHalfhand;
