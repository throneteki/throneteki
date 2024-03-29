const DrawCard = require('../../drawcard.js');

class ForgottenByHistory extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle character into deck',
            phase: 'dominance',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       card.getPrintedCost() <= card.controller.faction.power &&
                                       card.allowGameAction('returnCardToDeck')
            },
            handler: context => {
                context.target.owner.shuffleCardIntoDeck(context.target);
                this.game.addMessage('{0} plays {1} to shuffle {2} into {3}\'s deck',
                    context.player, this, context.target, context.target.owner);
            }
        });
    }
}

ForgottenByHistory.code = '08059';

module.exports = ForgottenByHistory;
