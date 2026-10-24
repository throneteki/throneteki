import PlotCard from '../../plotcard.js';

class Retaliation extends PlotCard {
    // Retaliation (07047)
    // If you win initiative, you must choose an opponent to be the first player.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.getPlayers().length > 1,
            targetController: 'current',
            effect: ability.effects.canSelectAsFirstPlayer(
                (player, context) => player !== context.source.controller
            )
        });
    }
}

Retaliation.code = '07047';

export default Retaliation;
