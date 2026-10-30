import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ChamberOfThePaintedTable extends DrawCard {
    // Chamber of the Painted Table (01060)
    // Reaction: After you win dominance, kneel Chamber of the Painted Table to move 1 power from an
    // opponent's faction card to your own.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) => context.player === event.winner
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a faction card',
                cardType: 'faction',
                cardCondition: (card, context) =>
                    card.getType() === 'faction' &&
                    card.controller !== context.player &&
                    card.power > 0
            },
            message: {
                format: "{player} kneels {source} to move 1 power from {opponent}'s faction card to their own",
                args: { opponent: (context) => context.target.controller }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.target,
                to: context.player.faction,
                amount: 1
            }))
        });
    }
}

ChamberOfThePaintedTable.code = '01060';

export default ChamberOfThePaintedTable;
