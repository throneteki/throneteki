const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Gared extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPlotRevealed: event => event.plot.hasTrait('Omen')
            },
            message: '{player} uses {source} to kneel each opponent\'s faction card',
            gameAction: GameActions.simultaneously(context => context.game.getOpponents(context.player).map(player => GameActions.kneelCard({ card: player.faction, source: this })))
        });
    }
}

Gared.code = '25551';
Gared.version = '1.0';

module.exports = Gared;
