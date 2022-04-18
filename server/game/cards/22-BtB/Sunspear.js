const DrawCard = require('../../drawcard.js');

class Sunspear extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            match: this,
            effect: ability.effects.canSpendGold(spendParams => spendParams.activePlayer === this.controller)
        });
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.isFaction('martell') && event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                let amount = context.event.card.hasTrait('Lord') || context.event.card.hasTrait('Lady') ? 2 : 1;
                this.modifyGold(amount);
                this.game.addMessage('{0} uses {1} to place {2} gold from the treasury on {1}', this.controller, this, amount);
            }
        });
    }
}

Sunspear.code = '22012';

module.exports = Sunspear;
