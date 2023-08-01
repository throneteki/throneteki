const PlotCard = require('../../plotcard.js');

class TheWatchNeedsGoodMen extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canMarshal(card => card.controller !== this.controller && card.location === 'discard pile' && card.getType() === 'character')
        });
    }
}

TheWatchNeedsGoodMen.code = '25560';
TheWatchNeedsGoodMen.version = '1.0';

module.exports = TheWatchNeedsGoodMen;
