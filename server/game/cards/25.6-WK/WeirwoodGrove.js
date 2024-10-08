import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WeirwoodGrove extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: (event) =>
                    event.plot.controller !== this.controller &&
                    !!event.plot.getWhenRevealedAbility()
            },
            cost: [ability.costs.kneelFactionCard(), ability.costs.removeSelfFromGame()],
            message: {
                format: '{player} kneels their faction card and removes {costs.removeFromGame} from the game to initiate the when revealed ability of {plot}',
                args: { plot: (context) => context.event.plot }
            },
            gameAction: GameActions.genericHandler((context) => {
                let whenRevealed = context.event.plot.getWhenRevealedAbility();
                // Attach the current When Revealed event to the new context
                let newContext = whenRevealed.createContext(context.event);
                newContext.player = context.player;
                this.game.resolveAbility(whenRevealed, newContext);
            })
        });
    }
}

WeirwoodGrove.code = '25110';

export default WeirwoodGrove;
