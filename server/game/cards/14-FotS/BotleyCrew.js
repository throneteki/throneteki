import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BotleyCrew extends DrawCard {
    // Botley Crew (14025)
    // Reaction: After an opponent collects income, return 1 gold from that player's gold pool to
    // the treasury.
    setupCardAbilities() {
        this.reaction({
            when: {
                onIncomeCollected: (event, context) =>
                    event.player !== context.source.controller && event.player.gold > 0
            },
            message: {
                format: "{player} uses {source} to return 1 gold from {incomeCollector}'s gold pool to the treasury",
                args: { incomeCollector: (context) => context.event.player }
            },
            gameAction: GameActions.returnGoldToTreasury((context) => ({
                player: context.event.player,
                amount: 1
            }))
        });
    }
}

BotleyCrew.code = '14025';

export default BotleyCrew;
