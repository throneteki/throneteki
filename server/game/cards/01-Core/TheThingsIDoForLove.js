const DrawCard = require('../../drawcard.js');

const _ = require('underscore');

class TheThingsIDoForLove extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character to owner\'s hand',
            condition: () => this.controller.anyCardsInPlay(card => card.isFaction('lannister') && (card.hasTrait('Lord') || card.hasTrait('Lady'))),
            phase: 'challenge',
            cost: [
                ability.costs.kneelFactionCard(),
                //There's no max aside from the player's gold which is handled in the cost function
                ability.costs.payXGold(() => this.getMinimumCharCost(), () => 99)
            ],
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character' &&
                                                  (context.xValue ? (card.getCost() <= context.xValue) : (card.getCost() <= this.controller.gold))
            },
            handler: context => {
                context.target.controller.returnCardToHand(context.target);
                this.game.addMessage('{0} plays {1}, kneels their faction card and pays {2} gold to return {3} to {4}\'s hand',
                    context.player, this, context.goldCost, context.target, context.target.owner);
            }
        });
    }

    getMinimumCharCost() {
        let opponents = this.game.getOpponents(this.controller);
        let opponentCharacters = _.flatten(opponents.map(opponent => opponent.filterCardsInPlay(card => card.getType() === 'character')));
        let charCosts = _.map(opponentCharacters, card => card.getCost());

        return _.min(charCosts);
    }
}

TheThingsIDoForLove.code = '01101';

module.exports = TheThingsIDoForLove;
