import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SerHarysSwyft extends DrawCard {
    // Ser Harys Swyft (18006)
    // Action: Move 1 gold from your gold pool to a card without gold. (Limit twice per round.)
    // +1 Income.
    setupCardAbilities(ability) {
        this.action({
            title: 'Move gold',
            limit: ability.limit.perRound(2),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' && !card.hasToken(Tokens.gold)
            },
            message: '{player} uses {source} to move 1 gold from their gold pool to {target}',
            gameAction: GameActions.transferGold((context) => ({
                from: context.player,
                to: context.target,
                amount: 1
            }))
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

SerHarysSwyft.code = '18006';

export default SerHarysSwyft;
