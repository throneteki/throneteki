import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Bloodraven extends DrawCard {
    // Bloodraven (25017)
    // Insight. No attachments except Old Gods.
    // Reaction: After the plot phase begins, sacrifice Bloodraven to choose an opponent. You may
    // look at that player's chosen plot card before you choose a plot card to reveal this phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'plot'
            },
            chooseOpponent: true,
            cost: ability.costs.sacrificeSelf(),
            message:
                "{player} sacrifices {costs.sacrifice} to look at {opponent}'s plot choice before choosing their own this phase",
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: context.opponent,
                effect: ability.effects.mustShowPlotSelection(context.player)
            }))
        });
    }
}

Bloodraven.code = '25017';

export default Bloodraven;
