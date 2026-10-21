import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WeirwoodGrove extends DrawCard {
    // Weirwood Grove (25110)
    // Reaction: After an opponent reveals a non-Omen plot card, kneel your faction card and remove
    // Weirwood Grove from the game to initiate the when revealed ability on that card as if you had
    // just revealed it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: (event, context) =>
                    event.plot.controller !== context.source.controller &&
                    !event.plot.hasTrait('Omen') &&
                    !!event.plot.getWhenRevealedAbility()
            },
            cost: [ability.costs.kneelFactionCard(), ability.costs.removeSelfFromGame()],
            message: {
                format: '{player} kneels their faction card and removes {costs.removeFromGame} from the game to initiate the when revealed ability of {plot}',
                args: { plot: (context) => context.event.plot }
            },
            gameAction: GameActions.initiateWhenRevealed((context) => ({
                plot: context.event.plot
            }))
        });
    }
}

WeirwoodGrove.code = '25110';

export default WeirwoodGrove;
