import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Sandstone extends DrawCard {
    // Sandstone (21012)
    // Reaction: After you win a challenge as the attacking player, kneel Sandstone to have an
    // attacking character gain 1 power for each defending character with fewer than 2 challenge
    // icons (to a maximum of 3 power).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.attackingPlayer === context.player &&
                    sandstonePower(event.challenge) > 0
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) => card.isAttacking()
            },
            message: {
                format: '{player} uses {source} to have {target} gain {power} power',
                args: { power: (context) => sandstonePower(context.event.challenge) }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.target,
                amount: sandstonePower(context.event.challenge)
            }))
        });
    }
}

function sandstonePower(challenge) {
    return Math.min(3, challenge.defenders.filter((card) => card.getNumberOfIcons() < 2).length);
}

Sandstone.code = '21012';

export default Sandstone;
