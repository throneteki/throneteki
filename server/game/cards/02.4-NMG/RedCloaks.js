import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class RedCloaks extends DrawCard {
    // Red Cloaks (02070)
    // During [intrigue] challenges, Red Cloaks gets +1 STR for each gold on it.
    // Action: Move 1 gold from your gold pool to Red Cloaks. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold from your gold pool to this card',
            limit: ability.limit.perPhase(1),
            message: '{player} moves 1 gold from their gold pool to {source}',
            gameAction: GameActions.transferGold((context) => ({
                from: context.player,
                to: context.source,
                amount: 1
            }))
        });
        this.persistentEffect({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card) => card.tokens[Tokens.gold] || 0)
        });
    }
}

RedCloaks.code = '02070';

export default RedCloaks;
