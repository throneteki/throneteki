import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhiteTree extends DrawCard {
    // White Tree (04007)
    // Reaction: After an opponent collects income, kneel White Tree to move 1 gold from that
    // player's gold pool to your own.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIncomeCollected: (event, context) => event.player !== context.player
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: "{player} kneels {source} to move 1 gold from {opponent}'s gold pool to their own",
                args: { opponent: (context) => context.event.player }
            },
            gameAction: GameActions.transferGold((context) => ({
                from: context.event.player,
                to: context.player,
                amount: 1
            }))
        });
    }
}

WhiteTree.code = '04007';

export default WhiteTree;
