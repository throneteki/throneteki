const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Winterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2
        });
        this.reaction({
            when: {
                onSacrificed: () => this.game.anyPlotHasTrait('Winter'),
                onCharacterKilled: () => this.game.anyPlotHasTrait('Winter')
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to discard the top {amount} cards of {owner}\'s deck',
                args: {
                    amount: context => this.getAmount(context),
                    owner: context => context.event.card.owner
                }
            },
            gameAction: GameActions.discardTopCards(context => ({
                player: context.event.card.owner,
                amount: this.getAmount(),
                source: this
            }))
        });
    }
    getAmount(context) {
        return context.event.card.getPrintedCost();
    }
}

Winterfell.code = '25520';
Winterfell.version = '1.0';

module.exports = Winterfell;
