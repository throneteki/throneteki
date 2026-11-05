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
                onChallengeInitiated: (event, context) =>
                    event.challenge.isMatch({
                        initiatedAgainstPlayer: context.source.controller,
                        attackingAlone: context.source.parent
                    })
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to kill {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.kill((context) => ({ card: context.source.parent }))
        });
    }
}

Insubordination.code = '25030';

export default Insubordination;
