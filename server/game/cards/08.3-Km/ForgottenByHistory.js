import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ForgottenByHistory extends DrawCard {
    // Forgotten By History (08059)
    // Dominance Action: Kneel your faction card to choose a character with printed cost X or lower,
    // and shuffle it into its owner's deck. X is the amount of power on the faction card of that
    // character's controller.
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle character into deck',
            phase: 'dominance',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= card.controller.faction.power &&
                    GameActions.shuffleIntoDeck({ cards: [card] }).allow()
            },
            message: {
                format: "{player} plays {source} to shuffle {target} into {owner}'s deck",
                args: { owner: (context) => context.target.owner }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.shuffleIntoDeck((context) => ({ cards: [context.target] })),
                    context
                );
            }
        });
    }
}

ForgottenByHistory.code = '08059';

export default ForgottenByHistory;
