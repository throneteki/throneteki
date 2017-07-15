const DrawCard = require('../../../drawcard.js');

class TheIronBankWillHaveItsDue extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character to gain gold',
            condition: () => this.game.currentPhase !== 'taxation',
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.returnToHand(card => card.getType() === 'character')
            ],
            handler: context => {
                let returnedCard = context.costs.returnedToHandCard;
                let gold = returnedCard.getPrintedCost();
                this.game.addGold(this.controller, gold);

                this.untilEndOfRound(ability => ({
                    targetType: 'player',
                    effect: ability.effects.cannotMarshalOrPutIntoPlayByTitle(returnedCard.name)
                }));

                this.game.addMessage('{0} plays {1}, kneels their faction card and returns {2} to their hand to gain {3} gold',
                                      this.controller, this, returnedCard, gold);
                this.game.addMessage('{0} cannot marshal or put into play any card titled {1} until the end of the round', 
                                      this.controller, returnedCard.name);
            }
        });
    }
}

TheIronBankWillHaveItsDue.code = '06099';

module.exports = TheIronBankWillHaveItsDue;
