const DrawCard = require('../../drawcard.js');

class AreoHotah extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', () => this.controller.getNumberOfUsedPlots())
        });

        this.reaction({
            when: {
                afterChallenge: event => this.controller === event.challenge.winner && event.challenge.isDefending(this)
            },
            cost: ability.costs.returnSelfToHand(),
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: card => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage('{0} returns {1} to their hand to raise the claim value on their revealed plot card by 1 until the end of the phase',
                    context.player, this);
            }
        });
    }
}

AreoHotah.code = '10006';

module.exports = AreoHotah;
