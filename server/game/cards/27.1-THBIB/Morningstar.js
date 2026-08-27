import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Morningstar extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        challengeType: 'military',
                        winner: this.controller
                    }) &&
                    !!this.parent &&
                    this.parent.isParticipating()
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to stand {parent} and remove them from the challenge',
                args: { parent: () => this.parent }
            },
            handler: (context) => {
                const parent = this.parent;
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.standCard({ card: parent }),
                        GameActions.removeFromChallenge({ card: parent })
                    ]),
                    context
                );
            }
        });
    }
}

Morningstar.code = '27016';

export default Morningstar;
