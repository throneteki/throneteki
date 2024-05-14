import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TradingWithQohor extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay((card) => card.getType() === 'attachment'),
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyGold(1)
        });

        this.reaction({
            when: {
                onClaimApplied: (event) => event.player === this.controller
            },
            cost: ability.costs.sacrifice(
                (card) => card.getType() === 'attachment' && card.hasPrintedCost()
            ),
            message: {
                format: '{player} uses {source} to search their deck for another attachment with printed cost {sacrificeCost} or lower',
                args: { sacrificeCost: (context) => context.costs.sacrifice.getPrintedCost() }
            },
            gameAction: GameActions.search({
                title: 'Select an attachment',
                match: {
                    type: 'attachment',
                    condition: (card, context) =>
                        card.hasPrintedCost() &&
                        card.getPrintedCost() <= context.costs.sacrifice.getPrintedCost() &&
                        card.name !== context.costs.sacrifice.name
                },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

TradingWithQohor.code = '11039';

export default TradingWithQohor;
