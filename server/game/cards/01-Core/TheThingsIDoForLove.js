import DrawCard from '../../drawcard.js';
import { flatten } from '../../../Array.js';
import GameActions from '../../GameActions/index.js';

class TheThingsIDoForLove extends DrawCard {
    // The Things I Do For Love (01101)
    // Play only if you control a [lannister] Lord or Lady character.
    // Challenges Action: Kneel your faction card to choose a character with printed cost X or lower
    // controlled by an opponent, and return it to its owner's hand.
    setupCardAbilities(ability) {
        this.xValue({
            min: (context) => getMinimumCharCost(context),
            max: () => 99
        });

        this.action({
            title: "Return character to owner's hand",
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        card.isFaction('lannister') &&
                        (card.hasTrait('Lord') || card.hasTrait('Lady'))
                ),
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller !== context.player &&
                    card.getType() === 'character' &&
                    (context.xValue !== undefined
                        ? card.getPrintedCost() <= context.xValue
                        : card.getPrintedCost() <= context.player.getSpendableGold())
            },
            message: {
                format: "{player} plays {source}, kneels their faction card and pays {costs.gold} gold to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

function getMinimumCharCost(context) {
    let opponents = context.game.getOpponents(context.player);
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

TheThingsIDoForLove.code = '01101';

export default TheThingsIDoForLove;
