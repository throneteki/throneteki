const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class BotleyCrew extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onIncomeCollected: (event) =>
                    event.player !== this.controller && event.player.gold > 0
            },
            message: {
                format: "{player} uses {source} to return 1 gold from {incomeCollector}'s gold pool to the treasury",
                args: { incomeCollector: (context) => context.event.player }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnGoldToTreasury((context) => ({
                        player: context.event.player,
                        amount: 1
                    })),
                    context
                );
            }
        });
    }
}

BotleyCrew.code = '14025';

module.exports = BotleyCrew;
