const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class MeereeneseMarket extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Place card on bottom of deck',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.location === 'discard pile'
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck((context) => ({
                        card: context.target,
                        bottom: true
                    })),
                    context
                );
                this.game.addMessage(
                    "{0} kneels {1} to place {2} on the bottom of {3}'s deck",
                    this.controller,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

MeereeneseMarket.code = '11074';

module.exports = MeereeneseMarket;
