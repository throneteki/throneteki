import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Insubordination extends DrawCard {
    // Insubordination (25030)
    // Terminal.
    // Reaction: After a challenge is initiated against you in which attached character is attacking
    // alone, kneel Insubordination to kill attached character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.isMatch({
                        initiatedAgainstPlayer: this.controller,
                        attackingAlone: this.parent
                    })
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to kill {parent}',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.kill(() => ({ card: this.parent }))
        });
    }
}

Insubordination.code = '25030';

export default Insubordination;
