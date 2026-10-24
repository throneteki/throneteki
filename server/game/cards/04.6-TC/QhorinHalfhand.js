import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QhorinHalfhand extends DrawCard {
    // Qhorin Halfhand (04105)
    // Renown. No attachments except Weapon.
    // Reaction: After you win a [military] challenge in which Qhorin Halfhand is participating,
    // choose and kill a non-unique character with lower STR than his controlled by the losing
    // opponent.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.loser &&
                    card.getType() === 'character' &&
                    !card.isUnique() &&
                    card.getStrength() < context.source.getStrength(),
                gameAction: 'kill'
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

QhorinHalfhand.code = '04105';

export default QhorinHalfhand;
