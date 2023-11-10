const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class WarriorsSons extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: event => event.card === this,
                onCardPowerMoved: event => event.target === this
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard(context => ({ card: context.event.card || context.event.target }))
        });
    }
}

WarriorsSons.code = '25529';
WarriorsSons.version = '1.0';

module.exports = WarriorsSons;
