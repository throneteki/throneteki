import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AMeagerContribution extends DrawCard {
    // A Meager Contribution (01138)
    // Reaction: After an opponent collects income, move 1 gold from that player's gold pool to your
    // own. (Max 1 per round.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perRound(1),
            when: {
                onIncomeCollected: (event, context) => event.player !== context.player
            },
            message: {
                format: "{player} plays {source} to move 1 gold from {opponent}'s gold pool to their own",
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

AMeagerContribution.code = '01138';

export default AMeagerContribution;
