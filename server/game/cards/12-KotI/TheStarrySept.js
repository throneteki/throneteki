const DrawCard = require('../../drawcard');

class TheStarrySept extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move 1 power + blank',
            condition: () => this.power > 0,
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to move 1 power to {2} and blank them until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
                this.game.movePower(this, context.target, 1);
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));
            }
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, challengeType: 'power' }) &&
                    this.canGainPower()
            },
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to have {1} gain 1 power', context.player, this);
                this.modifyPower(1);
            }
        });
    }
}

TheStarrySept.code = '12042';

module.exports = TheStarrySept;
