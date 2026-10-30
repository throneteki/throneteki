import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Clydas extends DrawCard {
    // Clydas (17117)
    // Action: Kneel Clydas or a Raven card to move 1 gold from an opponent's gold pool to your own.
    // (Limit twice per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold to your gold pool',
            chooseOpponent: true,
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneel(
                (card, context) => card === context.source || card.hasTrait('Raven')
            ),
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

Clydas.code = '17117';

export default Clydas;
