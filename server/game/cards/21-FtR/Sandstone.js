const DrawCard = require('../../drawcard.js');

class Sandstone extends DrawCard {
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

module.exports = Sandstone;
