import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TradingWithQohor extends AgendaCard {
    // Trading With Qohor (11039)
    // While you control no attachments, increase the gold value on each opponent’s revealed plot
    // card by 1.
    // Reaction: After claim is applied for a challenge you won, sacrifice an attachment to search
    // your deck for a different attachment with equal or lower printed cost and put it into play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay(
                    (card) => card.getType() === 'attachment'
                ),
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyGold(1)
        });

        this.reaction({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge && event.player === context.player
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
