import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Goldengrove extends DrawCard {
    // Goldengrove (21024)
    // Action: Kneel Goldengrove or a Small Council character to choose another card you own with
    // equal or lower printed cost. Stand that card and take control of it. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and take control',
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneel(
                (card, context) =>
                    card === context.source ||
                    (card.hasTrait('Small Council') && card.getType() === 'character')
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.owner === context.player &&
                    (!context.costs.kneel ||
                        (card !== context.costs.kneel &&
                            card.getPrintedCost() <= context.costs.kneel.getPrintedCost()))
            },
            message: {
                format: '{player} uses {source} and kneels {kneltCard} to stand and take control of {target}',
                args: { kneltCard: (context) => context.costs.kneel }
            },
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.takeControl((context) => ({
                    player: context.player,
                    card: context.target
                }))
            ])
        });
    }
}

Goldengrove.code = '21024';

export default Goldengrove;
