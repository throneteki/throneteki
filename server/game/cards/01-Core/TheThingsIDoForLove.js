import DrawCard from '../../drawcard.js';
import { flatten } from '../../../Array.js';

class TheThingsIDoForLove extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: "Return character to owner's hand",
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) =>
                        card.isFaction('lannister') &&
                        (card.hasTrait('Lord') || card.hasTrait('Lady'))
                ),
            phase: 'challenge',
            cost: [
                ability.costs.kneelFactionCard(),
                //There's no max aside from the player's gold which is handled in the cost function
                ability.costs.payXGold(
                    () => this.getMinimumCharCost(),
                    () => 99
                )
            ],
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller !== this.controller &&
                    card.getType() === 'character' &&
                    (context.xValue
                        ? card.getPrintedCost() <= context.xValue
                        : card.getPrintedCost() <= this.controller.getSpendableGold())
            },
            handler: (context) => {
                context.target.controller.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} plays {1}, kneels their faction card and pays {2} gold to return {3} to {4}'s hand",
                    context.player,
                    this,
                    context.costs.gold,
                    context.target,
                    context.target.owner
                );
            }
        });
    }

    getMinimumCharCost() {
        let opponents = this.game.getOpponents(this.controller);
        let opponentCharacters = flatten(
            opponents.map((opponent) =>
                opponent.filterCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasPrintedCost()
                )
            )
        );
        let charCosts = opponentCharacters.map((card) => card.getPrintedCost());

        return Math.min(...charCosts);
    }
}

TheThingsIDoForLove.code = '01101';

export default TheThingsIDoForLove;
