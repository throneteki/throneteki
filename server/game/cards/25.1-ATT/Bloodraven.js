const DrawCard = require('../../drawcard.js');

class Bloodraven extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'plot'
            },
            chooseOpponent: true,
            cost: ability.costs.sacrificeSelf(),
            message:
                "{player} sacrifices {costs.sacrifice} to look at {opponent}'s plot choice before choosing their own this phase",
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: context.opponent,
                    effect: ability.effects.mustShowPlotSelection(context.player)
                }));
            }
        });
    }
}

Bloodraven.code = '25017';

module.exports = Bloodraven;
