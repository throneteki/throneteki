const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class Sunspear extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            match: this,
            effect: ability.effects.canSpendGold(spendParams => spendParams.activePlayer === this.controller)
        });

        const amountGained = (context) => {
            return context.event.card.hasTrait('Lord') || context.event.card.hasTrait('Lady') ? 2 : 1;
        };

        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.isFaction('martell') && event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to place {amountGained} gold from the treasury on {source}',
                args: { amountGained: context => amountGained(context) }
            },
            gameAction: GameActions.placeToken(context => ({
                card: context.source,
                token: Tokens.gold,
                amount: amountGained(context)
            }))
        });
    }
}

Sunspear.code = '22012';

module.exports = Sunspear;
