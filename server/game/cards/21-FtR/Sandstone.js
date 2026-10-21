import DrawCard from '../../drawcard.js';

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
                    this.game.currentChallenge.defenders.some((d) => d.getNumberOfIcons() < 2)
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) => card.isAttacking() && card.canGainPower()
            },
            handler: (context) => {
                let power = Math.min(
                    3,
                    this.game.currentChallenge.defenders.filter((d) => d.getNumberOfIcons() < 2)
                        .length
                );
                context.target.modifyPower(power);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain {3} power.',
                    context.player,
                    this,
                    context.target,
                    power
                );
            }
        });
    }
}

Sandstone.code = '21012';

export default Sandstone;
