const DrawCard = require('../../drawcard.js');

class OlennasMachinations extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            max: ability.limit.perPhase(1),
            title: 'Raise power challenge limit',
            handler: () => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('power')
                }));
                this.game.addMessage(
                    '{0} plays {1} to be able to initiate an additional {2} challenge this phase',
                    this.controller,
                    this,
                    'power'
                );
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage(
                    '{0} pays 1 gold to move {1} back to their hand',
                    this.controller,
                    this
                );
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

OlennasMachinations.code = '06084';

module.exports = OlennasMachinations;
