import PlotCard from '../../plotcard.js';

class Retaliation extends PlotCard {
    // Retaliation (07047)
    // If you win initiative, you must choose an opponent to be the first player.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getPlayers().length > 1,
            targetController: 'current',
            effect: ability.effects.canSelectAsFirstPlayer((player) => player !== this.controller)
        });
    }
}

Retaliation.code = '07047';

export default Retaliation;
