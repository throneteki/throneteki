import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Clydas extends DrawCard {
    // Clydas (15033)
    // Action: Move 1 gold from an opponent's gold pool to your own. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold to your gold pool',
            chooseOpponent: true,
            limit: ability.limit.perPhase(1),
            message: {
                format: "{player} uses {source} to move 1 gold from {opponent}'s gold pool to their own",
                args: { opponent: (context) => context.opponent }
            },
            gameAction: GameActions.transferGold((context) => ({
                from: context.opponent,
                to: context.player,
                amount: 1
            }))
        });
    }
}

Clydas.code = '15033';

export default Clydas;
