import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Morningstar extends DrawCard {
    // Morningstar (27016)
    // Character you control only.
    // Reaction: After you win a [military] challenge in which attached character is participating,
    // kneel Morningstar to stand attached character and remove it from the challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        challengeType: 'military',
                        winner: context.player
                    }) &&
                    !!context.source.parent &&
                    event.challenge.isParticipating(context.source.parent)
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to stand {parent} and remove them from the challenge',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.simultaneously((context) => [
                GameActions.standCard({ card: context.source.parent }),
                GameActions.removeFromChallenge({ card: context.source.parent })
            ])
        });
    }
}

Morningstar.code = '27016';

export default Morningstar;
