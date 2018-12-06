const DrawCard = require('../../drawcard');

class ScoutingVessel extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPillage: event => event.source.getType() === 'character' && event.source.controller === this.controller && event.numCards === 1
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                this.game.addMessage('{0} kneels and sacrifices {1} to discard 3 cards with pillage instead', context.player, this);
                context.event.numCards = 3;
            }
        });
    }
}

ScoutingVessel.code = '12020';

module.exports = ScoutingVessel;
