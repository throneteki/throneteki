const DrawCard = require('../../drawcard');

class ScoutingVessel extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPillage: event => event.source.getType() === 'character' && event.source.controller === this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            message: '{player} kneels and sacrifices {source} to discard 3 cards with pillage instead of 1',
            handler: context => {
                context.event.numCards += 2;
            }
        });
    }
}

ScoutingVessel.code = '12020';

module.exports = ScoutingVessel;
