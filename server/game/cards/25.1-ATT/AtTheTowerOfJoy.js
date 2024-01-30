const PlotCard = require('../../plotcard.js');

class AtTheTowerOfJoy extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: { type: 'character', location: 'play area' }
            },
            message: '{player} uses {source} to make {target} unkillable until the end of the round',
            handler: context => {
                this.lastingEffect(ability => ({
                    until: {
                        onCardEntersPlay: event => event.card.getType() === 'plot' && event.card.controller === context.player
                    },
                    match: context.target,
                    effect: ability.effects.cannotBeKilled()
                }));
            }
        });
    }
}

AtTheTowerOfJoy.code = '25019';

module.exports = AtTheTowerOfJoy;
