const DrawCard = require('../../drawcard.js');

class DragonEgg extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('Insight')
        });

        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'marshal' && this.parent.name === 'Daenerys Targaryen'
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                //todo add search effect
            }
        });
    }
}

DragonEgg.code = '15020';

module.exports = DragonEgg;
