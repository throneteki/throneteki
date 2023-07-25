const PlotCard = require('../../plotcard.js');

class AtTheTowerOfJoy extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: { type: 'character', location: 'play area' }
            },
            message: '{player} uses {source} to make {target} unkillable until the end of the round',
            handler: context => {
                this.untilEndOfRound(ability => ({
                    match: context.target,
                    effect: ability.effects.cannotBeKilled()
                }));
            }
        });
    }
}

AtTheTowerOfJoy.code = '25611';
AtTheTowerOfJoy.version = '1.0';

module.exports = AtTheTowerOfJoy;
